// common constant shared within server/client
const config = {
  EXTERNAL_URL: 'http://localhost:3000',    // reverse proxy related
  WEBAPP_PREFIX: '',   // like 'webapp', NOTE: no '/' here (baseUrl '/' + prefix)
  WEBAPP_MOUNT_DOCROOT_ID: 'app',   // about to move to constant, no need to config here
  PORT: 3000,
  DISABLE_SERVER_RENDER: false,
  DISABLE_CLIENT_RENDER: false,
}

export default config
