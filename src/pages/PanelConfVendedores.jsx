import { useEffect, useState } from "react";
import { getCampoMaximo } from "../utils/getCampoMaximo";

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
        const totVisitas = Object.values(nuevosDias).reduce(
          (acc, val) => acc + val,
          0
        );
        const comisionPorDia = v.comisionPorDiaManual
          ? v.comisionPorDia
          : Math.min((totVisitas / 360) * 0.5, 0.5);

        const total =
          v.comision +
          comisionPorDia +
          v.valorVehiculo +
          v.valorMeta +
          v.valorClientesAct +
          v.valorClientesRec +
          v.valorSku +
          v.valorGrupoNeg +
          v.clientesConve +
          v.valorCobranza;

        return {
          ...v,
          dias: nuevosDias,
          totVisitas,
          comisionPorDia: parseFloat(comisionPorDia.toFixed(3)),
          total: parseFloat(Math.min(total, 3).toFixed(2)),
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

        if (key === "comisionPorDia") {
          actualizado.comisionPorDiaManual = true;
        }

        const total =
          actualizado.comision +
          actualizado.comisionPorDia +
          actualizado.valorVehiculo +
          actualizado.valorMeta +
          actualizado.valorClientesAct +
          actualizado.valorClientesRec +
          actualizado.valorSku +
          actualizado.valorGrupoNeg +
          actualizado.clientesConve +
          actualizado.valorCobranza;

        return {
          ...actualizado,
          total: parseFloat(Math.min(total, 3).toFixed(2)),
        };
      })
    );
  };

  const guardarConfiguracion = (id) => {
    const vendedor = vendedores.find((v) => v.id === id);
    if (!vendedor) return;

    const payload = {
      id: vendedor.id,
      nombre: vendedor.nombre,
      rol: vendedor.rol,
      ruta: vendedor.ruta,
      segmento: vendedor.segmento,
      comision: vendedor.comision,
      comisionPorDia: vendedor.comisionPorDia,
      valorVehiculo: vendedor.valorVehiculo,
      valorMeta: vendedor.valorMeta,
      valorClientesAct: vendedor.valorClientesAct,
      valorClientesRec: vendedor.valorClientesRec,
      valorSku: vendedor.valorSku,
      valorGrupoNeg: vendedor.valorGrupoNeg,
      clientesConve: vendedor.clientesConve,
      valorCobranza: vendedor.valorCobranza,
      dias: vendedor.dias,
      totVisitas: vendedor.totVisitas,
      total: vendedor.total,
    };

    console.log("Configuración individual:", JSON.stringify(payload, null, 2));
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
          },
          totVisitas: 0,
          comisionPorDiaManual: false,
          comisionPorDia: 0,
          valorVehiculo: 0,
          valorMeta: 0,
          valorClientesAct: 0,
          valorClientesRec: 0,
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
                    <th className="px-35 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "comision")}
                          step={0.01}
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

                      {/* Días de la semana */}
                      <td className="px-10 py-4 text-sm text-center align-top">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                          ].map((dia) => (
                            <div
                              key={dia}
                              className="flex flex-col items-center"
                            >
                              <label className="text-[10px] text-gray-500 dark:text-gray-300 mb-1">
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
                                className="w-14 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Comisión por día */}
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "comisionPorDia")}
                          step={0.01}
                          value={v.comisionPorDia}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "comisionPorDia",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                        />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">
                          %
                        </span>
                      </td>

                      {/* Comisión por vehiculo */}
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorVehiculo")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorMeta")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorClientesAct")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorClientesRec")}
                          step={0.01}
                          value={v.valorClientesRec}
                          onChange={(e) =>
                            handleChange(
                              v.id,
                              "valorClientesRec",
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorSku")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorGrupoNeg")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "clientesConve")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">
                        <input
                          type="number"
                          min={0}
                          max={getCampoMaximo(v, "valorCobranza")}
                          step={0.01}
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
                      <td className="py-4 text-sm text-center">{v.total}%</td>

                      {/* Botón de guardar */}
                      <td className="py-4 text-sm text-center">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelConfVendedores;
