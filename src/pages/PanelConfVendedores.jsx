import { useEffect, useState } from "react";

const PanelConfVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [loading, setLoading] = useState(true);

  //Actualizar dias de la semana
  const handleDiaChange = (id, dia, valor) => {
    setVendedores((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;

        const nuevosDias = { ...v.dias, [dia]: valor };
        const totDias = Object.values(nuevosDias).reduce(
          (acc, val) => acc + val,
          0
        );

        const total =
          v.comision +
          v.comisionPorDia +
          v.valorVehiculo +
          v.valorMeta +
          v.valorClientesAct +
          v.valorClienteRec +
          v.valorSku +
          v.valorGrupoNeg +
          v.clientesConve +
          v.valorCobranza;

        return {
          ...v,
          dias: nuevosDias,
          totDias,
          total: parseFloat(total.toFixed(2)),
        };
      })
    );
  };

  //Actualiza el total de comision
  const handleChange = (id, key, value) => {
    setVendedores((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const actualizado = { ...v, [key]: value };

        const total =
          actualizado.comision +
          actualizado.comisionPorDia +
          actualizado.valorVehiculo +
          actualizado.valorMeta +
          actualizado.valorClientesAct +
          actualizado.valorClienteRec +
          actualizado.valorSku +
          actualizado.valorGrupoNeg +
          actualizado.clientesConve +
          actualizado.valorCobranza;

        return { ...actualizado, total: parseFloat(total.toFixed(2)) };
      })
    );
  };

  const guardarConfiguracion = (id) => {
    const vendedor = vendedores.find((v) => v.id === id);
    console.log("Configuración guardada:", vendedor);
    // Aquí podrías hacer un POST a tu API para guardar
  };

  //enviar datos
  const enviarTodo = () => {
    const payload = vendedores.map((v) => ({
      id: v.id,
      nombre: v.nombre,
      rol: v.rol,
      ruta: v.ruta,
      segmento: v.segmento,
      comision: v.comision,
      dias: v.dias,
      totDias: v.totDias,
      comisionPorDia: v.comisionPorDia,
      valorVehiculo: v.valorVehiculo,
      valorMeta: v.valorMeta,
      valorClientesAct: v.valorClientesAct,
      valorClienteRec: v.valorClienteRec,
      valorSku: v.valorSku,
      valorGrupoNeg: v.valorGrupoNeg,
      clientesConve: v.clientesConve,
      valorCobranza: v.valorCobranza,
      total: v.total,
    }));

    console.log(JSON.stringify(payload, null, 2));
  };

  //Segmentos
  useEffect(() => {
    fetch("https://18.144.115.199.nip.io/api/clientes/segmentos")
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Respuesta no es JSON");
        }
        return res.json();
      })
      .then((data) => {
        setSegmentos(data);
      })
      .catch((error) => {
        console.error("Error al cargar segmentos:", error);
      });
  }, []);

  //Clientes
  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.4.80:8001/api/auditoria/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const extendidos = data.map((v) => ({
          ...v,
          rol: "",
          ruta: "",
          segmento: "",
          comision: 0,
          dias: {
            Lunes: 0,
            Martes: 0,
            Miércoles: 0,
            Jueves: 0,
            Viernes: 0,
            Sábado: 0,
            Domingo: 0,
          },
          totDias: 0,
          comisionPorDia: 0,
          valorVehiculo: 0,
          valorMeta: 0,
          valorClientesAct: 0,
          valorClienteRec: 0,
          valorSku: 0,
          valorGrupoNeg: 0,
          clientesConve: 0,
          valorCobranza: 0,
          total: 0,
        }));
        setVendedores(extendidos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar vendedores:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-1 min-h-screen bg-white dark:bg-gray-800">
      <h2 className="text-3xl text-center font-bold mb-6 text-gray-800 dark:text-white">
        Configuración de Vendedores
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300 text-lg py-10">
          Cargando datos...
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
          <div className="overflow-x-auto">
            <div className="max-h-[900px] overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                      Vendedor
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ruta
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Segmento
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Base
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dias
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Visitas
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Vehiculo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Meta
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Clientes Activos
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Clientes Recuperado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión SKU Promedio
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Grupo Negociaciones
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Valor Convenios
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Valor Cobranza
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comisión Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Guardar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {vendedores.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                        {v.nombre}
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4 text-sm text-center">
                        <select
                          value={v.rol}
                          onChange={(e) =>
                            handleChange(v.id, "rol", e.target.value)
                          }
                          className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-28"
                        >
                          <option value="">Seleccionar</option>
                          <option value="ASESOR">ASESOR</option>
                          <option value="JR">JR</option>
                        </select>
                      </td>

                      {/* Ruta (solo si es ASESOR) */}
                      <td className="px-6 py-4 text-sm text-center">
                        {v.rol === "ASESOR" ? (
                          <select
                            value={v.ruta}
                            onChange={(e) =>
                              handleChange(v.id, "ruta", e.target.value)
                            }
                            className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-28"
                          >
                            <option value="">Ruta</option>
                            <option value="NORTE">NORTE</option>
                            <option value="SUR">SUR</option>
                            <option value="CENTRO">CENTRO</option>
                          </select>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            —
                          </span>
                        )}
                      </td>

                      {/* Segmento */}
                      <td className="px-6 py-4 text-sm text-center">
                        <select
                          value={v.segmento}
                          onChange={(e) =>
                            handleChange(v.id, "segmento", e.target.value)
                          }
                          className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-28"
                        >
                          <option value="">Segmento</option>
                          {segmentos.map((seg) => (
                            <option key={seg.co_seg} value={seg.co_seg}>
                              {seg.seg_des}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Comisión base */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={3}
                          step={0.1}
                          value={v.comision}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "comision",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>
                      {/* Dias de la semana */}
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                            "Domingo",
                          ].map((dia) => (
                            <div
                              key={dia}
                              className="flex items-center justify-between"
                            >
                              <label className="text-xs text-gray-500 dark:text-gray-300">
                                {dia.slice(0, 3)}
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={v.dias[dia]}
                                onChange={(e) =>
                                  handleDiaChange(
                                    v.id,
                                    dia,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-12 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                              />
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Comisión por dia */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0.5}
                          step={0.1}
                          value={v.comisionPorDia}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "comisionPorDia",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por vehiculo */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0.35}
                          step={0.1}
                          value={v.valorVehiculo}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorVehiculo",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por meta */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0.25}
                          step={0.1}
                          value={v.valorMeta}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorMeta",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por clientes activos */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0.4}
                          step={0.1}
                          value={v.valorClientesAct}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorClientesAct",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por clientes recuperados */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0}
                          step={0.1}
                          value={v.valorClienteRec}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorClienteRec",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión sku promedio */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0}
                          step={0.1}
                          value={v.valorSku}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorSku",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión valor grupo de negociaciones */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0.5}
                          step={0.1}
                          value={v.valorGrupoNeg}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorGrupoNeg",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por convenios */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0}
                          step={0.1}
                          value={v.clientesConve}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "clientesConve",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* valor de cobranza */}
                      <td className="px-6 py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={0}
                          step={0.1}
                          value={v.valorCobranza}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorCobranza",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* comision total */}
                      <td className="px-6 py-4 text-sm text-center">
                        {v.total}%
                      </td>

                      {/* Botón de guardar */}
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => guardarConfiguracion(v.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {vendedores.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                  No hay datos de vendedores.
                </div>
              )}
            </div>
            <div className="text-center my-6">
              <button
                onClick={enviarTodo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Enviar configuración completa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelConfVendedores;
