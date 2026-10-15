/** Casa Vieja: entorno SINTETICO, sin conexion a Sheets ni produccion.
 * API deshabilitada. No desplegar ni agregar credenciales productivas.
 */
function sandboxInfo() {
  return { environment: "synthetic", epoch: "TEST_ONLY", writesEnabled: false, productionAccess: false };
}
function doGet() {
  throw new Error("SANDBOX_NOT_CONFIGURED: API deshabilitada");
}
function doPost() {
  throw new Error("SANDBOX_NOT_CONFIGURED: escrituras deshabilitadas");
}
