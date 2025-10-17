export const getCampoMaximo = (vendedor, campo) => {
  const totalActual = vendedor.total;
  const valorActual = vendedor[campo];
  const margenDisponible = Math.max(0, 3 - totalActual + valorActual);

  const limitesTecnicos = {
    comision: 3,
    comisionPorDia: 0.5,
    valorVehiculo: 0.35,
    valorMeta: 0.25,
    valorClientesAct: 0.40,
    valorClientesRec: 0,
    valorSku: 0,
    valorGrupoNeg: 0.5,
    clientesConve: 0,
    valorCobranza: 1,
  };

  return Math.min(margenDisponible, limitesTecnicos[campo] || 0.35);
};
