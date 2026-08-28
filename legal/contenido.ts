// Copia en TypeScript del contenido de privacidad.md y terminos.md, para
// poder mostrarlo dentro de la app (Metro/React Native no puede importar
// archivos .md directamente como texto sin configuración adicional).
//
// IMPORTANTE: si editas privacidad.md o terminos.md, copia el cambio
// también aquí (y viceversa). Son el mismo contenido en dos formatos:
// el .md es el que se publica como página web pública; este archivo es
// el que lee la app para la pantalla "Legal".

export const PRIVACIDAD_MD = `# Política de privacidad de SneakVault

**Última actualización: 27 de agosto de 2026**

> ⚠️ **Aviso importante:** este documento es un borrador elaborado con ayuda de inteligencia artificial. No sustituye el asesoramiento de un abogado. Los puntos marcados con 🔴 deben revisarse con un profesional antes de publicar la app o empezar a cobrar a usuarios reales.

---

## 1. Quién es el responsable del tratamiento

**Responsable:** Óliver Álvarez Pérez
**Dirección de contacto:** Xosé María Cao, C.P. 27891, España _(recomendado añadir número y localidad para que la dirección quede completa)_
**Correo electrónico de contacto:** sneakersupport@gmail.com _(pendiente de crear — confirma que este buzón existe y lo revisas antes de publicar)_

🔴 **Revisar con un profesional:** si operas como autónomo o a través de una sociedad, esta sección debería incluir también tu NIF/CIF y, en su caso, tu nombre comercial registrado.

---

## 2. Qué datos recogemos y para qué

| Dato | ¿Qué es? | ¿Dónde se guarda? | ¿Para qué se usa? |
|---|---|---|---|
| Foto de la zapatilla | La imagen que tomas o eliges en el Escáner | **No se guarda en ningún servidor nuestro.** Se envía en tránsito a la API de Claude (Anthropic) para su análisis y se descarta tras la respuesta. La foto que ves en tu colección se queda guardada únicamente en tu propio teléfono. | Identificar marca, modelo, colorway y precio de reventa de la zapatilla |
| Datos de tu colección (marca, modelo, talla, estado, precio pagado, notas, fecha) | Lo que introduces al guardar una zapatilla | Exclusivamente en tu dispositivo (almacenamiento local de la app). Nunca llega a nuestros servidores. | Mostrarte tu colección y sus estadísticas |
| Datos de la suscripción (plan elegido, estado de la prueba gratuita, fecha de renovación) | Gestionados por Apple y por RevenueCat, nuestro proveedor de gestión de suscripciones | En los sistemas de Apple y RevenueCat, no en los nuestros | Darte acceso a las funciones Pro y gestionar tu suscripción |
| Datos técnicos mínimos de la conexión (p. ej. tu dirección IP, inherente a cualquier petición web) | Se genera automáticamente al llamar a nuestro servidor para identificar una zapatilla | No se registra ni se almacena de forma persistente en nuestros sistemas | Únicamente para que la petición técnica funcione |

**Importante sobre los datos de tu colección:** como esos datos nunca salen de tu teléfono ni llegan a nuestros sistemas, en la práctica no somos nosotros quienes los "tratamos" a efectos del RGPD — eres tú quien los guarda, en tu propio dispositivo. Si desinstalas la app o borras una zapatilla, esos datos desaparecen y nosotros no tenemos ninguna copia.

---

## 3. Base legal de cada tratamiento (art. 6 RGPD)

| Tratamiento | Base legal |
|---|---|
| Envío de la foto a Claude para identificarla | **Ejecución de un contrato** (art. 6.1.b) — es necesario para prestar el servicio que has pedido: identificar tu zapatilla |
| Gestión de la suscripción y el pago | **Ejecución de un contrato** (art. 6.1.b) — necesario para darte acceso a lo que has contratado |
| Funcionamiento técnico mínimo del servidor (IP de la conexión) | **Interés legítimo** (art. 6.1.f) — necesario para que el servicio funcione y para prevenir usos abusivos, con retención mínima |

---

## 4. Transferencias internacionales de datos

Las fotos que envías al Escáner se procesan por **Anthropic, PBC**, la empresa que opera la API de Claude, con sede en Estados Unidos. Esto implica una transferencia internacional de datos fuera del Espacio Económico Europeo.

Según la documentación pública de Anthropic vigente en la fecha de este documento:
- Sus términos comerciales incorporan un **Acuerdo de Tratamiento de Datos (DPA)** con **Cláusulas Contractuales Tipo de la Comisión Europea** (Módulo 2, responsable-a-encargado) como mecanismo de transferencia bajo el art. 46.2.c) RGPD.
- Los inputs y outputs de la API se retienen un máximo de **30 días** (los registros técnicos, 7 días) y **no se usan para entrenar modelos** por defecto.
- No guardamos ninguna copia propia de tus fotos: la única copia que existe fuera de tu teléfono es la que procesa Anthropic durante ese periodo.

🔴 **Revisar con un profesional:** este es el punto más delicado del documento. Antes de publicar la app deberías verificar personalmente las condiciones vigentes del DPA de Anthropic (pueden cambiar), confirmar que las Cláusulas Contractuales Tipo cubren adecuadamente tu caso de uso concreto, y valorar si necesitas informar de esto de forma más destacada (por ejemplo, con un aviso específico en la propia pantalla del Escáner, no solo en este documento).

---

## 5. Terceros que participan en el tratamiento

| Tercero | Qué hace | Qué datos ve |
|---|---|---|
| **Anthropic, PBC** | Identifica la zapatilla y busca su precio actual | La foto que envías (en tránsito, no almacenada por nosotros) |
| **Apple Inc.** | Procesa el pago de tu suscripción a través de la App Store | Tus datos de pago (nunca los vemos nosotros) y tu Apple ID |
| **RevenueCat, Inc.** | Gestiona el estado de tu suscripción (activa, en prueba, cancelada) | Un identificador anónimo de suscriptor y el estado de tu compra — no tu nombre ni tu email |

No compartimos, vendemos ni cedemos tus datos a nadie más.

---

## 6. Plazo de conservación

- **Fotos enviadas al Escáner:** no las conservamos. En los sistemas de Anthropic, hasta 30 días según su política estándar.
- **Fotos y datos de tu colección:** permanecen en tu dispositivo mientras uses la app; desaparecen si borras la zapatilla, desinstalas la app o borras los datos de la app desde los ajustes de tu teléfono.
- **Caché interna de precios** (marca + modelo + colorway + precio, sin ningún dato que te identifique): hasta 24 horas en la memoria de nuestro servidor, para no repetir búsquedas idénticas el mismo día.
- **Datos de suscripción:** los conservan Apple y RevenueCat según sus propias políticas.

---

## 7. Tus derechos

Bajo el RGPD, tienes derecho a:

- **Acceso**: saber qué datos tenemos sobre ti.
- **Rectificación**: corregir datos inexactos.
- **Supresión**: pedir que se borren tus datos.
- **Oposición**: oponerte a un tratamiento concreto.
- **Portabilidad**: recibir tus datos en un formato reutilizable.
- **Limitación**: pedir que se restrinja el tratamiento en ciertos casos.

Como la práctica totalidad de tus datos vive únicamente en tu dispositivo, la forma más directa de ejercer estos derechos sobre tu colección es simplemente **editarla o borrarla dentro de la propia app**, o desinstalarla.

Para cualquier otra solicitud (por ejemplo, sobre datos de tu suscripción), escríbenos a **sneakersupport@gmail.com**. Te responderemos en el plazo que marca la normativa (como máximo un mes).

**Derecho a reclamar:** si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la **Agencia Española de Protección de Datos (AEPD)** — [www.aepd.es](https://www.aepd.es).

---

## 8. Menores de edad

SneakVault no está dirigida a personas menores de **16 años**, que es la edad de consentimiento digital fijada por el RGPD. No recogemos conscientemente datos de menores de esa edad. Si tienes motivos para pensar que un menor de 16 años nos ha facilitado datos personales, escríbenos a sneakersupport@gmail.com y lo revisaremos.

---

## 9. Cambios en esta política

Podemos actualizar esta política cuando cambie algo relevante en la app (por ejemplo, si añadimos una nueva herramienta de terceros). Publicaremos siempre la fecha de la última actualización en la parte superior de este documento. Si el cambio es importante y afecta a usuarios de pago, te avisaremos también dentro de la app.

---

## 10. Resumen de puntos marcados para revisión legal 🔴

1. Añadir número y localidad a la dirección de contacto, para que quede completa del todo.
2. Confirmar la forma jurídica bajo la que operas (autónomo/sociedad) y si hace falta incluir NIF/CIF.
3. Verificar las condiciones vigentes del DPA/Cláusulas Contractuales Tipo de Anthropic antes de publicar, y valorar un aviso adicional en la pantalla del Escáner.
4. Crear el buzón sneakersupport@gmail.com y confirmar que lo revisas activamente antes de publicar.
`;

export const TERMINOS_MD = `# Términos de uso de SneakVault

**Última actualización: 27 de agosto de 2026**

> ⚠️ **Aviso importante:** este documento es un borrador elaborado con ayuda de inteligencia artificial. No sustituye el asesoramiento de un abogado. Los puntos marcados con 🔴 deben revisarse con un profesional antes de publicar la app o empezar a cobrar a usuarios reales.

Al usar SneakVault, aceptas estos términos. Si no estás de acuerdo, no uses la app.

**Responsable del servicio:** Óliver Álvarez Pérez, Xosé María Cao, C.P. 27891, España. Contacto: sneakersupport@gmail.com.

---

## 1. Descripción del servicio

SneakVault es una aplicación que te permite identificar zapatillas a partir de una foto (usando inteligencia artificial) y guardarlas en una colección personal en tu dispositivo, junto con su precio de reventa estimado.

### Qué incluye la versión gratuita
Uso básico de la app y de la colección, sujeto a los límites de escaneo que se indiquen dentro de la propia app.

### Qué incluye SneakVault Pro
- **Pro mensual:** 6,99 $/mes.
- **Pro anual:** 49,99 $/año (equivalente a ~4,17 $/mes).

Ambos planes incluyen: hasta 300 escaneos al mes, colección ilimitada, valor total estimado de tu colección y exportación de tus datos. Ambos planes incluyen **7 días de prueba gratuita**.

🔴 Los precios y límites exactos pueden cambiar; esta sección debe mantenerse sincronizada con lo que se muestre realmente en la pantalla de planes de la app.

---

## 2. Suscripción, cobro y cancelación

- La suscripción se gestiona a través de **Apple** (App Store) y de nuestro proveedor de gestión de suscripciones, **RevenueCat**.
- Al elegir un plan, empiezas una **prueba gratuita de 7 días**.
- **Si no cancelas antes de que termine la prueba**, se te cobrará automáticamente el precio del plan elegido a través de tu cuenta de Apple.
- La suscripción **se renueva automáticamente** al final de cada periodo (mensual o anual), salvo que la canceles antes.
- **Cómo cancelar:** en tu iPhone, ve a Ajustes → [tu nombre] → Suscripciones → SneakVault, y cancela desde ahí. Debes cancelar al menos 24 horas antes de que termine el periodo actual para evitar el siguiente cobro. Nosotros no podemos cancelarla por ti ni gestionar el cobro directamente: lo gestiona Apple.

---

## 3. Reembolsos

Todos los pagos se procesan a través de Apple. **Los reembolsos los gestiona exclusivamente Apple**, conforme a sus propias condiciones y procesos (normalmente desde reportaproblem.apple.com o contactando con el soporte de Apple). Nosotros no gestionamos ni concedemos reembolsos directamente.

---

## 4. Descargo de responsabilidad sobre la identificación y los precios

**Esto es importante, léelo con atención:**

- SneakVault usa inteligencia artificial para identificar la marca, el modelo y el colorway de una zapatilla a partir de una foto. **Esta identificación puede ser incorrecta.** No garantizamos que la identificación sea exacta.
- Los precios que se muestran (precio actual estimado, fuente y fecha de consulta) son **estimaciones informativas** obtenidas mediante búsqueda automática en internet. **No constituyen una tasación profesional, no son un consejo de inversión, y no garantizan el valor real de reventa de ninguna zapatilla.**
- **No nos hacemos responsables de ninguna decisión de compra, venta o cualquier otra transacción que tomes basándote en la identificación o en los precios mostrados por la app.** Úsalos como referencia orientativa, no como una fuente definitiva.

🔴 **Revisar con un profesional:** conviene confirmar que la redacción de este descargo (y su visibilidad dentro de la app, no solo en este documento) es suficiente para limitar responsabilidad conforme a la normativa española de consumidores, que no permite excluir determinadas garantías legales.

---

## 5. Uso aceptable

Al usar SneakVault, te comprometes a no:

- Usar la app con fines ilegales o fraudulentos.
- Intentar acceder sin autorización a nuestros sistemas o a los de nuestros proveedores.
- Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de la app más allá de lo permitido por la ley.
- Automatizar peticiones masivas a nuestro servidor (scraping, bots) fuera del uso normal de la app.
- Subir fotos que no sean tuyas o que infrinjan derechos de terceros, o contenido ilegal, ofensivo o inapropiado.

Podemos suspender o cancelar el acceso a la app si detectamos un uso que incumpla estas condiciones.

---

## 6. Propiedad intelectual

- El diseño, el código y los contenidos propios de SneakVault son propiedad de Óliver Álvarez Pérez, salvo que se indique lo contrario.
- Las marcas de zapatillas mencionadas o mostradas en la app (Nike, Adidas, Jordan, Balenciaga, New Balance, Converse, Vans, y cualquier otra) **pertenecen a sus respectivos titulares**. SneakVault **no está afiliada, patrocinada ni respaldada** por ninguna de estas marcas. Su mención tiene fines exclusivamente descriptivos e identificativos, dentro de un uso leal de la marca.

---

## 7. Limitación de responsabilidad

En la medida máxima permitida por la ley, SneakVault se ofrece "tal cual", sin garantías de ningún tipo sobre su disponibilidad continua, ausencia de errores, o idoneidad para un propósito concreto. No seremos responsables de daños indirectos, pérdida de beneficios, o decisiones económicas tomadas a partir del uso de la app (ver sección 4).

Esta limitación no afecta a los derechos que la ley reconoce a los consumidores y que no pueden excluirse por contrato (ver sección 9).

---

## 8. Ley aplicable y jurisdicción

Estos términos se rigen por la **legislación española**. Para cualquier controversia, y sin perjuicio del derecho que asiste a los consumidores de acudir a los tribunales de su propio domicilio conforme a la normativa de protección de consumidores de la UE, serán competentes los juzgados y tribunales españoles que correspondan según dicha normativa.

🔴 **Revisar con un profesional:** la redacción exacta de esta cláusula de jurisdicción, y su compatibilidad con las normas de protección de consumidores aplicables en el país de residencia de cada usuario dentro de la UE.

---

## 9. Derechos del consumidor que no pueden excluirse

Nada en estos términos limita o excluye los derechos que, como consumidor, te reconoce de forma imperativa la legislación española y de la Unión Europea (por ejemplo, garantías legales o el derecho de desistimiento cuando resulte aplicable). Si alguna cláusula de este documento entrara en conflicto con esos derechos, prevalecerá lo que marque la ley.

🔴 **Revisar con un profesional:** en particular, cómo interactúa el derecho de desistimiento de 14 días de la normativa de consumidores con un modelo de suscripción digital que empieza con una prueba gratuita de 7 días y cobro automático gestionado por Apple — esto suele requerir una redacción específica sobre la renuncia expresa (o no) al derecho de desistimiento al iniciar la prueba.

---

## 10. Cambios en estos términos

Podemos actualizar estos términos cuando cambien las condiciones del servicio (por ejemplo, precios o funciones incluidas en cada plan). Publicaremos la fecha de la última actualización en la parte superior de este documento y, si el cambio es relevante para usuarios de pago, te avisaremos dentro de la app.

---

## 11. Resumen de puntos marcados para revisión legal 🔴

1. Mantener sincronizados precios/límites de los planes con lo que se muestra realmente en la app.
2. Confirmar que el descargo de responsabilidad sobre identificación/precios (sección 4) es suficiente conforme a la normativa española de consumidores.
3. Revisar la cláusula de jurisdicción (sección 8) para asegurar compatibilidad con la normativa de protección de consumidores de la UE.
4. Definir correctamente la interacción entre el derecho de desistimiento de 14 días y el modelo de prueba gratuita + suscripción (sección 9).
`;
