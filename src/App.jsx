// src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // NOTA: El BrowserRouter debe envolver a App en main.jsx
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;

//Proyecto Auditoria de Vendedores

//
//Punto 2: Tabla de Vendedores
// Tabla con los vendedores (especificar si tienen asesores Jr y cuales)
// Mostrar los Segmentos que les corresponden en bitrix (Preguntar si eso lo van a ver vendedores y juniors)
// Dudas con el Monto base  %
// Guardar informacion por Meses (Hacer un cierre al final)
// Mostrar de nuevo los dias de la semana y ver si cumplio las metas de visitas (El valor de la visita es de 0.50%)
// Vehiculos, si aplica o no aplica (Preguntar de donde sale esa informacion) (El valor del vehiculo es de 0.35%)
// Cantidad de dolares que venda al mes (Valor de la meta 0.25%)
// Cantidad de clienes a los que se le vendio mercancia al mes. (Valor de la meta 0.40%)
// Clientes Recuperados (No tendra valor)
// Sku promedio (No tendra valor)
// Negociacion (Valor de la meta 0.50%) Nomenclatura: Buscar en la factura (H&M,ANGELUS,DISTRILAB ; Volumen; Personalizada) Contarlas.
// Clientes con convenio. (Preguntar de donde sale. Valor de la meta 0) tabla clientes/frecuencia de visita
// Cobranza (Ver si es mayor al 90%, Valor de la meta 1.00%)

//Todo esto no puede ser mayor a 3.00%
