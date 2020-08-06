const config = {
  port: 5000,
  modules: [
    {
      module: 'spotify',
      config: {
        client_id: '581e5b75c37e47d7a27eeaf6ffedd3c4',
        client_secret: '070fe4c6987e40999ee110c046253e67',
        redirect_uri: 'http://localhost:8888/callback',
        access_token:
          'BQCJWrT6UxR6S9TEAARjxXDD6lHX4XSOwTHHk7Okh8FoFfwUtWKjHtJY1ewrcqDzuFJxCmjQQ3n_usugPS1vhyPYwI4q5hwuTdofxBSl2NcDQYIVGMeUArbZnxQ2WuJVerGtlp-DOVJWG7GY2FANONdopkJlo_nfBtpV',
        refresh_token:
          'AQDQxKfVLsis9sX_UCrGRntOTiUbGjT9L5a1AEUkxu1qDx8Wwy_1UN9MfS5Spbh26Enjh4Eo-xBrha8K6TRuPKmEgNm9_mNabnwtn1zFdcnvs94I07uamrm3exnx-E3OCrc',
      },
    },

    {
      module: 'message',
      config: {},
    },

    {
      module: 'googlePhotos',
      config: {
        token_path: '/token.json',
        call_time: 0,
        scopes: [
          'https://www.googleapis.com/auth/photoslibrary',
          'https://www.googleapis.com/auth/photoslibrary.sharing',
        ],
        albumTitle: 'Mirror',
      },
    },

    {
      module: 'calendar',
      config: {
        pull_rate: 5000,
        ical_url:
          'https://calendar.google.com/calendar/ical/splgvglb55q2kpbnjbsrab75f4%40group.calendar.google.com/private-928abe1b658ce5021f7b473cef3a6faf/basic.ics',
      },
    },
  ],
}
module.exports = config
