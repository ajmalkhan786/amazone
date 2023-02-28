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

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const { redirect } = router.query;
  if (userInfo) {
    router.push("/");
  }
  const classess = useStyles();
  const submitHandler = async ({name, email, password, confirmpassword}) => {
    if (password !== confirmpassword) {
      alert("password don't matche");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/register", {
        name,
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
    <Layouts title="Register">
      <form onSubmit={handleSubmit(submitHandler)} className={classess.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="name"
                  label="Name"
                  fullWidth
                  inputProps={{ type: "name" }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === "minLength"
                        ? "Name length is more than 1"
                        : "Name is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattren: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
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
                minLength: 6,
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
            <Controller
              name="confirmpassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  id="confirmpassword"
                  label="Confirm Password"
                  fullWidth
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.confirmpassword
                      ? errors.confirmpassword.type === "minLength"
                        ? "Confirm your password"
                        : "Confirm password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" color="primary" fullWidth>
              Register
            </Button>
          </ListItem>
          <ListItem>
            {"Already have an account?"} &nbsp;
            <NextLink href={`/login?redirect=${redirect || "/"}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layouts>
  );
};

export default Register;
