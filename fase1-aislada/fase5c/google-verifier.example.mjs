// Adaptador propuesto para un proxy Node autorizado posteriormente.
// No se instala ni ejecuta: requiere un recurso y un cliente OAuth aún no aprobados.
import {OAuth2Client} from 'google-auth-library';
const client=new OAuth2Client();
export async function verifyIdToken(idToken,audience){
 if(!audience)throw Error('AUTH_CONFIGURATION');
 const ticket=await client.verifyIdToken({idToken,audience});
 return ticket.getPayload();
}
