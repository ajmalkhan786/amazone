import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import Layouts from "../components/Layouts";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useForm, Controller } from "react-hook-form";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { state, dispatch } = useContext(Store);
  const { user: {userInfo} } = state;
  const router = useRouter();
  const { redirect } = router.query;
  if (userInfo) {
    router.push(redirect || "/");
  }
  const classess = useStyles();
  const submitHandler = async ({ email, password}) => {
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      Cookies.set("userInfo", JSON.stringify(data));
      dispatch({ type: "USER_LOGIN", payload: data });
      console.log(data.token);
      window.location.assign(redirect || "/");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <Layouts title="Login">
      <form onSubmit={handleSubmit(submitHandler)} className={classess.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattren: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="email"
                  label="Email"
                  fullWidth
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
          <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="password"
                  label="Password"
                  fullWidth
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "Password length is more than 5"
                        : "Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" color="primary" fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            {"Don't have an account?"} &nbsp;
            <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layouts>
  );
};

export default Login;
