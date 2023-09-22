const environment = {
  serverUrl: import.meta.env.VITE_REACT_API_URL,
  /* -----------------------------------------------------*/

  // appUrl: window.location.origin,
  // s3Token:"?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3BBTXRKWXLAEXRDY%2F20220610%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220610T135525Z&X-Amz-Expires=604800&X-Amz-Signature=aed384ce816edb7c1c067ff2a2d2a21d3caf9a3bc7030cf19d33d1d308567c74&X-Amz-SignedHeaders=host",
  // googleClientId: "244211526007-4dsocmh3ljm4cj83uvspv03vusd1eco9.apps.googleusercontent.com",
  // facebookAppId: "627799544987034",

  /*----------------- production Stripe Public Key ---------------------*/
  // stripePublicKey: "",
  /* ------------------------------------------------------------------*/

  /*-------------------- Staging Stripe Public Key ---------------------*/
  // stripePublicKey: "",
  /* -------------------------------------------------------------------*/
  // guestToken:
  //   "",
};

export default environment;
