import { useEffect, useState } from "react";

const PanelConfVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (id, key, value) => {
    setVendedores((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [key]: value } : v))
    );
  };

  const guardarConfiguracion = (id) => {
    const vendedor = vendedores.find((v) => v.id === id);
    console.log("Configuración guardada:", vendedor);
    // Aquí podrías hacer un POST a tu API para guardar
  };

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
                    Guardar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {vendedores.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {v.nombre}
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4 text-sm text-center">
                      <select
                        value={v.rol}
                        onChange={(e) => handleChange(v.id, "rol", e.target.value)}
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
                          onChange={(e) => handleChange(v.id, "ruta", e.target.value)}
                          className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-28"
                        >
                          <option value="">Ruta</option>
                          <option value="NORTE">NORTE</option>
                          <option value="SUR">SUR</option>
                          <option value="CENTRO">CENTRO</option>
                        </select>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">—</span>
                      )}
                    </td>

                    {/* Segmento */}
                    <td className="px-6 py-4 text-sm text-center">
                      <select
                        value={v.segmento}
                        onChange={(e) => handleChange(v.id, "segmento", e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-28"
                      >
                        <option value="">Segmento</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
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
                          handleChange(v.id, "comision", parseFloat(e.target.value))
                        }
                        className="w-20 p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">%</span>
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
        </div>
      </div>
    )}
  </div>
);
}

export default PanelConfVendedores;
