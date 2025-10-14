import React, { useEffect, useState } from "react";

// Funciones de utilidad (se mantienen igual, solo la presentación cambia)
function agruparFechasPorSemana(fechas) {
  const semanas = [];
  for (let i = 0; i < fechas.length; i += 7) {
    semanas.push(fechas.slice(i, i + 7));
  }
  return semanas;
}

function getEstadoVisita(cantidad) {
  if (cantidad >= 15)
    return { texto: "Cumplido", clase: "bg-green-100 text-green-800" };
  if (cantidad >= 9)
    return { texto: "Regular", clase: "bg-yellow-100 text-yellow-800" };
  return { texto: "Bajo de lo esperado", clase: "bg-red-100 text-red-800" };
}

function getHorasLaboradas(horasObj) {
  if (!horasObj) return "0:00";
  const diffMs = horasObj.max - horasObj.min;
  if (diffMs <= 0) return "0:00";
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(totalMinutes / 60);
  const minutos = totalMinutes % 60;
  return `${horas}:${minutos.toString().padStart(2, "0")}`;
}

function getPromedioHorasDiarias(horasLaboradasUsuario, fechas) {
  if (!horasLaboradasUsuario) return "0:00";
  let totalMin = 0;
  let diasConHoras = 0;
  fechas.forEach((fecha) => {
    const h = horasLaboradasUsuario[fecha];
    if (h && h.max > h.min) {
      const diffMin = Math.floor((h.max - h.min) / (1000 * 60));
      totalMin += diffMin;
      diasConHoras++;
    }
  });
  if (diasConHoras === 0) return "0:00";
  const avgMin = Math.round(totalMin / diasConHoras);
  const horas = Math.floor(avgMin / 60);
  const minutos = avgMin % 60;
  return `${horas}:${minutos.toString().padStart(2, "0")}`;
}

const VendedoresTablePage = () => {
  const [vendedores, setVendedores] = useState([]);
  const [visitasPorDia, setVisitasPorDia] = useState({});
  const [loading, setLoading] = useState(true);
  const [fechas, setFechas] = useState([]);
  const [semanasAbiertas, setSemanasAbiertas] = useState({});
  const [horasLaboradas, setHorasLaboradas] = useState({});
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.4.80:8001/api/auditoria/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setVendedores(data);
        fetch(
          `http://192.168.4.80:8001/api/auditoria/gestiones-por-dia-mes?anio=${anio}&mes=${mes}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((res) => res.json())
          .then((visitasData) => {
            const fechasUnicas = Array.from(
              new Set(
                visitasData.map((item) => item.fecha_registro.slice(0, 10))
              )
            ).sort();
            setFechas(fechasUnicas);

            const visitasPorUsuario = {};
            visitasData.forEach((item) => {
              const fecha = item.fecha_registro.slice(0, 10);
              if (!visitasPorUsuario[item.usuario_id]) {
                visitasPorUsuario[item.usuario_id] = {};
              }
              if (!visitasPorUsuario[item.usuario_id][fecha]) {
                visitasPorUsuario[item.usuario_id][fecha] = 0;
              }
              visitasPorUsuario[item.usuario_id][fecha] += item.cantidad;
            });
            setVisitasPorDia(visitasPorUsuario);

            const horasPorUsuario = {};
            visitasData.forEach((item) => {
              const fecha = item.fecha_registro.slice(0, 10);
              let hora;
              if (item.fecha_registro.includes("T")) {
                hora = new Date(item.fecha_registro).getTime();
              } else {
                hora = new Date(
                  item.fecha_registro.replace(" ", "T") + "Z"
                ).getTime();
              }

              if (!horasPorUsuario[item.usuario_id])
                horasPorUsuario[item.usuario_id] = {};
              if (!horasPorUsuario[item.usuario_id][fecha]) {
                horasPorUsuario[item.usuario_id][fecha] = {
                  min: hora,
                  max: hora,
                };
              } else {
                horasPorUsuario[item.usuario_id][fecha].min = Math.min(
                  horasPorUsuario[item.usuario_id][fecha].min,
                  hora
                );
                horasPorUsuario[item.usuario_id][fecha].max = Math.max(
                  horasPorUsuario[item.usuario_id][fecha].max,
                  hora
                );
              }
            });
            setHorasLaboradas(horasPorUsuario);

            const semanas = agruparFechasPorSemana(fechasUnicas);
            const abiertas = {};
            semanas.forEach((_, i) => (abiertas[i] = i === semanas.length - 1));
            setSemanasAbiertas(abiertas);

            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [anio, mes]);

  const semanas = agruparFechasPorSemana(fechas);

  const handleSemanaClick = (i) => {
    setSemanasAbiertas((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  return     <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Tabla de Vendedores
      </h2>

      {/* Filtro de mes y año */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <label className="flex items-center space-x-2 text-gray-700">
          <span className="font-medium">Año:</span>
          <input
            type="number"
            min="2000"
            max="2100"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="w-24 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </label>
        <label className="flex items-center space-x-2 text-gray-700">
          <span className="font-medium">Mes:</span>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg py-10">
          Cargando datos...
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="sticky left-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                  rowSpan={2}
                >
                  Vendedor
                </th>
                {semanas.map((semana, i) => (
                  <th
                    key={i}
                    colSpan={semanasAbiertas[i] ? semana.length * 2 : 1}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSemanaClick(i)}
                  >
                    Semana {i + 1}
                    <span className="ml-2">
                      {semanasAbiertas[i] ? "▼" : "►"}
                    </span>
                  </th>
                ))}
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Promedio Horas/Día
                </th>
              </tr>
              <tr>
                {semanas.map((semana, i) =>
                  semanasAbiertas[i] ? (
                    semana.flatMap((fecha) => {
                      const d = new Date(fecha + "T00:00:00Z");
                      const dia = d.toLocaleDateString("es-ES", {
                        weekday: "short",
                        timeZone: "UTC",
                      });
                      return [
                        <th
                          key={fecha + "-gestiones"}
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"
                        >
                          <span className="block">
                            {d.getUTCDate()} {dia.toUpperCase()}
                          </span>
                          <span className="block mt-1 font-semibold text-gray-700">
                            Gestiones
                          </span>
                        </th>,
                        <th
                          key={fecha + "-horas"}
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"
                        >
                          <span className="block mt-1 font-semibold text-gray-700">
                            Horas
                          </span>
                        </th>,
                      ];
                    })
                  ) : (
                    <th key={`semana-cerrada-${i}`} className="px-6 py-3"></th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendedores.map((v) => (
                <tr key={v.id}>
                  <td className="sticky left-0 bg-white z-10 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {v.nombre}
                  </td>
                  {semanas.map((semana, i) =>
                    semanasAbiertas[i] ? (
                      semana.flatMap((fecha) => {
                        const cantidad = visitasPorDia[v.id]?.[fecha] || 0;
                        const estado = getEstadoVisita(cantidad);
                        const horas = getHorasLaboradas(
                          horasLaboradas[v.id]?.[fecha]
                        );
                        return [
                          <td
                            key={fecha + "-gestiones"}
                            className={`px-6 py-4 whitespace-nowrap text-sm text-center ${estado.clase} `}
                          >
                            <span className="font-bold">{cantidad}</span>
                            <div className="text-xs mt-1">{estado.texto}</div>
                          </td>,
                          <td
                            key={fecha + "-horas"}
                            className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                          >
                            {horas} H
                          </td>,
                        ];
                      })
                    ) : (
                      <td
                        key={`semana-cerrada-${i}`}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        <span className="font-bold">
                          {semana.reduce(
                            (sum, fecha) =>
                              sum + (visitasPorDia[v.id]?.[fecha] || 0),
                            0
                          )}
                        </span>
                        <div className="text-xs mt-1">Gestiones</div>
                      </td>
                    )
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-700">
                    {getPromedioHorasDiarias(horasLaboradas[v.id], fechas)} H
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendedores.length === 0 && !loading && (
            <div className="p-6 text-center text-gray-500">
              No hay datos de vendedores para este mes.
            </div>
          )}
        </div>
      )}
    </div>;
};

export default VendedoresTablePage;
