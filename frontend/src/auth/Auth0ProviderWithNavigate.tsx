import { AppState, Auth0Provider, User } from "@auth0/auth0-react";

type props = {
  children: React.ReactNode;
};

const Auth0ProviderWithNavigate = ({ children }: props) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;

  if (!domain || !clientId || !redirectUri) {
    throw new Error(
      "Please define the VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID and VITE_AUTH0_REDIRECT_URI environment variables inside .env file"
    );
  }

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    console.log(appState);
    console.log(user);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
