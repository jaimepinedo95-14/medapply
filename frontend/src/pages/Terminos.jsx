// Términos y Condiciones de Uso — MedApply
// Diferente a la Política de Privacidad: regula el uso del servicio, no el tratamiento de datos

function Articulo({ numero, titulo, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-azul-marino mb-3">
        Artículo {numero}. {titulo}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function Terminos() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
        <div className="bg-azul-marino text-white rounded-3xl p-8 mb-8 text-center">
          <div className="text-4xl mb-3">📜</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-blue-200 text-sm">
            Condiciones generales que regulan el uso de la plataforma MedApply en Colombia
          </p>
          <p className="text-blue-300 text-xs mt-3">
            Última actualización: junio de 2026 · Versión 1.0
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">

          {/* Aviso introductorio */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
            <p className="text-azul-marino text-sm leading-relaxed">
              Al acceder, registrarse o utilizar cualquier función de <strong>MedApply</strong>, el usuario acepta quedar
              vinculado por los presentes Términos y Condiciones de Uso. Si no acepta estas condiciones, debe
              abstenerse de usar la plataforma. Estos términos son distintos de la{" "}
              <a href="/privacidad" className="underline font-semibold">Política de Privacidad</a>, que regula
              el tratamiento de datos personales.
            </p>
          </div>

          <Articulo numero="1" titulo="Objeto y naturaleza del servicio">
            <p>
              MedApply es una plataforma digital de intermediación laboral especializada exclusivamente en el sector salud
              de Colombia, operada por <strong>MedApply S.A.S.</strong> (en adelante, "la Plataforma" o "MedApply"),
              con domicilio en Colombia.
            </p>
            <p>
              La Plataforma actúa como intermediario tecnológico entre candidatos (profesionales del sector salud)
              y empresas del sector salud que publican ofertas de empleo. MedApply <strong>no es parte</strong> de
              ninguna relación laboral que se genere entre los usuarios, ni actúa como empleador, agencia de empleo
              temporal, ni prestador de servicios de selección de personal con garantía de resultado.
            </p>
          </Articulo>

          <Articulo numero="2" titulo="Usuarios y tipos de cuenta">
            <p>MedApply contempla dos tipos de usuarios:</p>
            <div className="space-y-3 mt-2">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-azul-marino mb-1">👤 Candidatos</p>
                <p>Personas naturales que buscan empleo en el sector salud colombiano. El registro es gratuito. Pueden postularse a ofertas, crear su perfil profesional y acceder a un plan de visibilidad mejorada (Perfil Destacado) mediante suscripción mensual.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="font-semibold text-azul-marino mb-1">🏥 Empresas</p>
                <p>Personas jurídicas o naturales que operan en el sector salud y desean contratar personal. Pueden publicar ofertas y acceder a funcionalidades adicionales según el plan contratado (Gratuito, Básico o Premium).</p>
              </div>
            </div>
          </Articulo>

          <Articulo numero="3" titulo="Registro y condiciones de la cuenta">
            <p>Para acceder a las funcionalidades de MedApply, el usuario debe crear una cuenta proporcionando información verídica, completa y actualizada. El usuario es responsable de:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Notificar a MedApply de cualquier uso no autorizado de su cuenta</li>
              <li>Toda actividad realizada desde su cuenta, sea o no autorizada</li>
            </ul>
            <p>El registro está disponible solo para personas mayores de 18 años. MedApply se reserva el derecho de verificar la información suministrada y suspender cuentas con datos falsos o incompletos.</p>
          </Articulo>

          <Articulo numero="4" titulo="Obligaciones y conductas prohibidas">
            <p>Al usar MedApply, el usuario se compromete a:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Usar la plataforma únicamente para fines legítimos de empleo en el sector salud</li>
              <li>Publicar información verídica en perfiles y ofertas</li>
              <li>No discriminar por género, raza, religión, origen o condición de salud</li>
              <li>Respetar la privacidad de los demás usuarios</li>
            </ul>
            <p className="font-semibold text-azul-marino mt-3">Está expresamente prohibido:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Publicar ofertas de empleo falsas, engañosas o con fines distintos a la contratación</li>
              <li>Usar la plataforma para actividades ilegales, fraudes o estafas</li>
              <li>Extraer masivamente datos de candidatos o empresas (scraping)</li>
              <li>Contactar candidatos para fines distintos al proceso de selección de personal</li>
              <li>Crear múltiples cuentas para evadir suspensiones</li>
              <li>Publicar contenido difamatorio, discriminatorio u ofensivo</li>
              <li>Vender o ceder información de candidatos a terceros no autorizados</li>
            </ul>
          </Articulo>

          <Articulo numero="5" titulo="Publicación de ofertas de empleo">
            <p>Las empresas son exclusivamente responsables del contenido de las ofertas que publican. Cada oferta debe:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Corresponder a una vacante real y activa en el sector salud</li>
              <li>Incluir información verídica sobre el cargo, funciones, requisitos y condiciones laborales</li>
              <li>Cumplir con las normas laborales colombianas vigentes (Código Sustantivo del Trabajo)</li>
              <li>No incluir requisitos discriminatorios ilegales</li>
            </ul>
            <p>MedApply puede suspender o eliminar ofertas que incumplan estas condiciones, sin previo aviso y sin derecho a devolución del pago correspondiente.</p>
          </Articulo>

          <Articulo numero="6" titulo="Postulaciones y proceso de selección">
            <p>MedApply facilita el envío de postulaciones pero <strong>no garantiza</strong>:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Que el candidato sea contactado por la empresa</li>
              <li>Que la empresa responda a las postulaciones</li>
              <li>Que el proceso de selección se realice en tiempos específicos</li>
              <li>La contratación efectiva del candidato</li>
            </ul>
            <p>Las relaciones laborales que resulten de los contactos realizados a través de MedApply son exclusivamente entre el candidato y la empresa, sin intervención ni responsabilidad de la Plataforma.</p>
          </Articulo>

          <Articulo numero="7" titulo="Planes, precios y pagos">
            <p>MedApply ofrece planes de suscripción con los siguientes precios en pesos colombianos (COP) con IVA incluido:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-2">
              <p className="font-semibold text-azul-marino mb-2">Para candidatos:</p>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Gratuito:</strong> $0 COP/mes</li>
                <li>• <strong>Destacado:</strong> $9.900 COP/mes</li>
              </ul>
              <p className="font-semibold text-azul-marino mb-2 mt-3">Para empresas:</p>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Gratuito:</strong> $0 COP/mes</li>
                <li>• <strong>Básico:</strong> $79.900 COP/mes</li>
                <li>• <strong>Premium:</strong> $159.900 COP/mes</li>
              </ul>
            </div>
            <p>Los cobros son mensuales y se realizan mediante PSE o tarjeta débito/crédito a través de pasarela de pago segura. El usuario puede cancelar su suscripción en cualquier momento; el plan se mantendrá activo hasta el final del período pagado.</p>
            <p>MedApply puede modificar los precios con previo aviso de 30 días. Las suscripciones activas no serán modificadas hasta el siguiente ciclo de renovación.</p>
          </Articulo>

          <Articulo numero="8" titulo="Política de reembolsos">
            <p>Los pagos realizados por suscripciones de plataforma <strong>no son reembolsables</strong>, salvo en los siguientes casos:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Error técnico comprobable atribuible a MedApply que impidió el acceso al servicio contratado</li>
              <li>Cobro duplicado por error en el sistema de pagos</li>
            </ul>
            <p>Las solicitudes de reembolso deben presentarse dentro de los 5 días hábiles siguientes al cargo, enviando correo a pagos@medapply.co con el comprobante de pago.</p>
          </Articulo>

          <Articulo numero="9" titulo="Propiedad intelectual">
            <p>
              Todo el contenido de MedApply — incluyendo diseño, código, textos, logotipos, nombres comerciales,
              iconografía y funcionalidades — es propiedad de MedApply S.A.S. o de sus licenciantes, y está protegido
              por las leyes de propiedad intelectual de Colombia y los tratados internacionales aplicables.
            </p>
            <p>Queda prohibida la reproducción, distribución, modificación o uso comercial de cualquier elemento de la
              plataforma sin autorización expresa y escrita de MedApply.</p>
            <p>El usuario conserva la propiedad de todo el contenido que sube a la plataforma (perfil, hoja de vida, fotos,
              videos) y otorga a MedApply una licencia no exclusiva para mostrar dicho contenido a los usuarios
              autorizados de la plataforma mientras la cuenta permanezca activa.</p>
          </Articulo>

          <Articulo numero="10" titulo="Limitación de responsabilidad">
            <p>MedApply no será responsable por:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>La veracidad o precisión de la información publicada por candidatos o empresas</li>
              <li>Las decisiones de contratación tomadas por las empresas</li>
              <li>Los resultados de los procesos de selección</li>
              <li>Pérdidas económicas derivadas del uso o imposibilidad de uso de la plataforma</li>
              <li>Interrupciones del servicio por mantenimiento, fallos técnicos o causas de fuerza mayor</li>
              <li>Conductas fraudulentas de terceros usuarios de la plataforma</li>
            </ul>
            <p>En ningún caso la responsabilidad total de MedApply superará el monto pagado por el usuario en los 3 meses anteriores al evento que dio lugar al reclamo.</p>
          </Articulo>

          <Articulo numero="11" titulo="Suspensión y cancelación de cuentas">
            <p>MedApply puede suspender o cancelar una cuenta, de forma temporal o definitiva, cuando:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Se compruebe incumplimiento de estos Términos y Condiciones</li>
              <li>Se detecte actividad fraudulenta o abusiva</li>
              <li>Se reciban reportes fundados de otros usuarios</li>
              <li>Exista requerimiento de autoridad competente</li>
            </ul>
            <p>El usuario puede solicitar la cancelación de su cuenta en cualquier momento desde la sección Configuración de su panel o enviando correo a hola@medapply.co.</p>
          </Articulo>

          <Articulo numero="12" titulo="Modificaciones al servicio y a estos términos">
            <p>MedApply se reserva el derecho de modificar, suspender o descontinuar cualquier función de la plataforma en cualquier momento. Los cambios sustanciales a estos Términos serán notificados con al menos 15 días de anticipación por correo electrónico.</p>
            <p>El uso continuado de la plataforma después de la notificación implica la aceptación de los nuevos términos.</p>
          </Articulo>

          <Articulo numero="13" titulo="Legislación aplicable y resolución de conflictos">
            <p>Estos Términos y Condiciones se rigen por las leyes de la República de Colombia, incluyendo:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Código de Comercio colombiano</li>
              <li>Ley 527 de 1999 (Comercio electrónico)</li>
              <li>Ley 1480 de 2011 (Estatuto del Consumidor)</li>
              <li>Código Sustantivo del Trabajo (respecto a relaciones laborales intermediadas)</li>
            </ul>
            <p>Cualquier controversia derivada del uso de la plataforma que no pueda resolverse amigablemente será sometida a los jueces y tribunales ordinarios de la ciudad de Bogotá D.C., Colombia, renunciando las partes a cualquier otro fuero que pudiera corresponderles.</p>
          </Articulo>

          <Articulo numero="14" titulo="Contacto">
            <div className="bg-azul-marino text-white rounded-2xl p-5">
              <p className="font-semibold mb-3">Para cualquier consulta sobre estos Términos y Condiciones:</p>
              <ul className="space-y-1.5 text-sm text-blue-200">
                <li>📧 Correo general: <strong className="text-white">hola@medapply.co</strong></li>
                <li>📧 Legal: <strong className="text-white">legal@medapply.co</strong></li>
                <li>🌐 Sitio web: <strong className="text-white">www.medapply.co</strong></li>
              </ul>
            </div>
          </Articulo>

        </div>
      </div>
    </div>
  );
}
