import { Route } from "react-router";

const PublicRoute = ({ component: Component, provider, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        provider ? <Component {...props} /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
