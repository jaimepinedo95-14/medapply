// Política de Tratamiento de Datos Personales según Ley 1581 de 2012 — Colombia

function Seccion({ numero, titulo, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-azul-marino mb-3">
        {numero}. {titulo}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function Privacidad() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
        <div className="bg-azul-marino text-white rounded-3xl p-8 mb-8 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="text-blue-200 text-sm">
            Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 — República de Colombia
          </p>
          <p className="text-blue-300 text-xs mt-3">
            Última actualización: junio de 2026 · Vigencia: desde el 01 de junio de 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">

          {/* Introducción */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
            <p className="text-azul-marino text-sm leading-relaxed">
              <strong>MedApply</strong> (en adelante "la Plataforma"), comprometida con la protección de la privacidad y los datos personales de sus usuarios, adopta la presente política de conformidad con la <strong>Ley Estatutaria 1581 de 2012</strong>, el <strong>Decreto Reglamentario 1377 de 2013</strong> y demás normas concordantes que regulan la protección de datos personales en Colombia.
            </p>
          </div>

          <Seccion numero="1" titulo="Identificación del Responsable del Tratamiento">
            <p>
              El responsable del tratamiento de los datos personales recolectados a través de la plataforma MedApply es:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 not-prose">
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Razón social:</strong> MedApply S.A.S.</li>
                <li><strong>Domicilio:</strong> Colombia</li>
                <li><strong>Correo electrónico:</strong> privacidad@medapply.co</li>
                <li><strong>Sitio web:</strong> www.medapply.co</li>
              </ul>
            </div>
          </Seccion>

          <Seccion numero="2" titulo="Marco Legal">
            <p>Esta política se fundamenta en:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Ley 1581 de 2012 — Protección de Datos Personales</li>
              <li>Decreto 1377 de 2013 — Reglamentación parcial de la Ley 1581</li>
              <li>Decreto Único Reglamentario 1074 de 2015</li>
              <li>Circular Externa 002 de 2015 de la Superintendencia de Industria y Comercio (SIC)</li>
            </ul>
          </Seccion>

          <Seccion numero="3" titulo="Definiciones">
            <div className="space-y-2">
              {[
                ["Dato personal", "Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable."],
                ["Dato sensible", "Aquel que afecta la intimidad del titular o cuyo uso indebido puede generar discriminación (origen racial, estado de salud, vida sexual, datos biométricos, convicciones políticas o religiosas)."],
                ["Tratamiento", "Cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación, supresión, etc."],
                ["Titular", "La persona natural cuyos datos personales son objeto de tratamiento."],
                ["Responsable", "MedApply, quien decide sobre la base de datos y/o el tratamiento."],
                ["Encargado", "Persona natural o jurídica que realiza el tratamiento por cuenta del Responsable."],
                ["Aviso de privacidad", "Comunicación verbal o escrita al titular sobre la existencia de la política de tratamiento de datos."],
              ].map(([term, def]) => (
                <p key={term}><strong className="text-azul-marino">{term}:</strong> {def}</p>
              ))}
            </div>
          </Seccion>

          <Seccion numero="4" titulo="Datos Personales Recolectados">
            <p>MedApply recolecta las siguientes categorías de datos según el tipo de usuario:</p>

            <div className="mt-3 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-azul-marino mb-2">👤 Candidatos (profesionales de la salud):</p>
                <ul className="list-disc list-inside space-y-0.5 pl-2 text-sm">
                  <li>Nombre completo, número de cédula de ciudadanía</li>
                  <li>Correo electrónico, número de teléfono</li>
                  <li>Ciudad de residencia, categoría profesional</li>
                  <li>Fotografía de perfil (opcional)</li>
                  <li>Experiencia laboral: empresas, cargos, fechas, funciones</li>
                  <li>Formación académica: instituciones, títulos, años de graduación</li>
                  <li>Hoja de vida en formato PDF</li>
                  <li>Historial de postulaciones realizadas a través de la plataforma</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="font-semibold text-azul-marino mb-2">🏥 Empresas del sector salud:</p>
                <ul className="list-disc list-inside space-y-0.5 pl-2 text-sm">
                  <li>Nombre o razón social de la empresa</li>
                  <li>NIT (Número de Identificación Tributaria)</li>
                  <li>Correo electrónico corporativo, teléfono de contacto</li>
                  <li>Ciudad de operación principal, tipo de empresa</li>
                  <li>Descripción institucional, logo de la empresa</li>
                  <li>Ofertas laborales publicadas en la plataforma</li>
                  <li>Información de facturación y pagos (para planes de pago)</li>
                </ul>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              * MedApply no recolecta datos sensibles como estado de salud, origen étnico, creencias religiosas o afiliación política.
            </p>
          </Seccion>

          <Seccion numero="5" titulo="Finalidades del Tratamiento">
            <p>Los datos personales recolectados serán utilizados para:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Crear y gestionar cuentas de usuario en la plataforma</li>
              <li>Facilitar la conexión entre candidatos del sector salud y empresas contratantes</li>
              <li>Permitir a las empresas visualizar perfiles de candidatos y gestionar postulaciones</li>
              <li>Enviar notificaciones relacionadas con ofertas de empleo y postulaciones</li>
              <li>Procesar pagos de suscripciones y generar facturas electrónicas</li>
              <li>Mejorar los servicios de la plataforma mediante análisis estadísticos anonimizados</li>
              <li>Dar cumplimiento a obligaciones legales, fiscales y regulatorias</li>
              <li>Enviar comunicaciones de marketing (solo con autorización expresa del titular)</li>
              <li>Atender peticiones, quejas, reclamos y solicitudes (PQRS)</li>
            </ul>
          </Seccion>

          <Seccion numero="6" titulo="Derechos del Titular">
            <p>En virtud del artículo 8 de la Ley 1581 de 2012, el titular de los datos personales tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Conocer:</strong> saber qué datos personales suyos están siendo objeto de tratamiento</li>
              <li><strong>Actualizar y rectificar:</strong> solicitar la corrección de datos inexactos, incompletos o fraccionados</li>
              <li><strong>Suprimir:</strong> solicitar la eliminación de sus datos cuando no sean necesarios para la finalidad del tratamiento o cuando haya revocado la autorización</li>
              <li><strong>Revocar la autorización:</strong> retirar el consentimiento otorgado para el tratamiento, salvo cuando exista obligación legal</li>
              <li><strong>Acceder:</strong> obtener información sobre los datos tratados y el uso dado a los mismos</li>
              <li><strong>Presentar quejas:</strong> ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la normativa de protección de datos</li>
              <li><strong>Ser informado:</strong> sobre los usos que se han dado a sus datos personales</li>
            </ul>
          </Seccion>

          <Seccion numero="7" titulo="Procedimiento para el Ejercicio de Derechos">
            <p>Para ejercer sus derechos, el titular podrá presentar solicitud escrita o verbal a través de los siguientes canales:</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <ul className="space-y-1 text-sm">
                <li>📧 <strong>Correo electrónico:</strong> privacidad@medapply.co</li>
                <li>⏰ <strong>Tiempo de respuesta:</strong> Máximo diez (10) días hábiles para consultas; máximo quince (15) días hábiles para reclamos</li>
              </ul>
            </div>
            <p>La solicitud debe incluir: nombre completo, número de identificación, descripción del derecho a ejercer y los datos de contacto del titular.</p>
          </Seccion>

          <Seccion numero="8" titulo="Transferencia y Transmisión de Datos">
            <p>MedApply podrá compartir datos personales con:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Empresas registradas en la plataforma:</strong> los datos del candidato (perfil profesional, hoja de vida) serán visibles para empresas que tengan plan Premium, únicamente cuando el candidato haya autorizado expresamente la visibilidad de su perfil</li>
              <li><strong>Proveedores de servicios tecnológicos:</strong> como alojamiento en la nube (Supabase/PostgreSQL) y herramientas de análisis, quienes actúan como encargados del tratamiento bajo estrictas condiciones de confidencialidad</li>
              <li><strong>Pasarelas de pago:</strong> para el procesamiento seguro de transacciones económicas</li>
              <li><strong>Autoridades competentes:</strong> cuando sea requerido por ley o por orden judicial</li>
            </ul>
            <p>MedApply no venderá, alquilará ni cederá datos personales a terceros con fines comerciales sin autorización previa del titular.</p>
          </Seccion>

          <Seccion numero="9" titulo="Seguridad de la Información">
            <p>MedApply implementa medidas técnicas, administrativas y físicas para proteger los datos personales contra acceso no autorizado, pérdida, alteración o destrucción, incluyendo:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Encriptación de contraseñas mediante algoritmos de hashing seguros (bcrypt)</li>
              <li>Conexiones cifradas HTTPS/TLS en toda la plataforma</li>
              <li>Control de acceso por roles y permisos</li>
              <li>Copias de seguridad periódicas de la base de datos</li>
              <li>Monitoreo continuo de accesos y actividades sospechosas</li>
            </ul>
          </Seccion>

          <Seccion numero="10" titulo="Conservación de los Datos">
            <p>Los datos personales serán conservados por el tiempo necesario para cumplir las finalidades del tratamiento y las obligaciones legales aplicables:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Mientras la cuenta del usuario esté activa en la plataforma</li>
              <li>Por un período adicional de hasta cinco (5) años después de la cancelación de la cuenta, en cumplimiento de obligaciones tributarias y legales</li>
              <li>Los datos de pagos y transacciones se conservarán por diez (10) años conforme a la normativa tributaria colombiana</li>
            </ul>
          </Seccion>

          <Seccion numero="11" titulo="Autorización del Titular">
            <p>El tratamiento de datos personales en MedApply se realiza únicamente con la autorización previa, expresa e informada del titular, obtenida mediante:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>La aceptación del checkbox de política de datos en el formulario de registro</li>
              <li>El uso continuado de la plataforma una vez informado sobre esta política</li>
            </ul>
            <p>Para datos sensibles, se requiere autorización expresa y específica del titular.</p>
          </Seccion>

          <Seccion numero="12" titulo="Modificaciones a la Política">
            <p>MedApply se reserva el derecho de modificar esta política en cualquier momento. Los cambios serán notificados a los titulares mediante:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Correo electrónico a la dirección registrada en la cuenta</li>
              <li>Aviso visible en la plataforma web</li>
            </ul>
            <p>El uso continuado de la plataforma después de la notificación implica la aceptación de los cambios realizados.</p>
          </Seccion>

          <Seccion numero="13" titulo="Vigencia">
            <p>La presente política de tratamiento de datos personales rige a partir del <strong>1 de junio de 2026</strong> y estará vigente mientras MedApply desarrolle sus actividades como plataforma de intermediación laboral en el sector salud de Colombia.</p>
          </Seccion>

          {/* Contacto */}
          <div className="bg-azul-marino text-white rounded-2xl p-6 mt-8">
            <h3 className="font-bold text-lg mb-2">¿Tienes dudas sobre tus datos personales?</h3>
            <p className="text-blue-200 text-sm mb-4">
              Contáctanos a través de nuestros canales oficiales. Responderemos en los términos establecidos por la ley.
            </p>
            <p className="text-sm">
              📧 <strong>privacidad@medapply.co</strong>
            </p>
            <p className="text-blue-300 text-xs mt-3">
              También puedes presentar quejas ante la Superintendencia de Industria y Comercio (SIC): <strong>www.sic.gov.co</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
