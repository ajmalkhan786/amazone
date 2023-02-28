import {
    Button,
    List,
    ListItem,
    TextField,
    Typography,
  } from "@material-ui/core";
  import Layouts from "../components/Layouts";
  import useStyles from "../utils/styles";
  import { useContext } from "react";
  import { Store } from "../utils/Store";
  import { useRouter } from "next/router";
  import Cookies from "js-cookie";
  import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import CheckOutCart from "../components/CheckOutCart";
  
  const Shipping = () => {
    const {
      handleSubmit,
      control,
      formState: { errors },
      setValue,
    } = useForm();
    const { state, dispatch } = useContext(Store);
    const { user, cart: {shippingAddress} } = state;
    const router = useRouter();
    useEffect(() => {
        if (!user.userInfo) {
          router.push("/login?redirect=/shipping");
        }
        setValue('fullname', shippingAddress.fullname)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postalcode', shippingAddress.postalcode)
        setValue('country', shippingAddress.country)
    }, [])
    const classess = useStyles();
    const submitHandler = ({fullname, address, city, postalcode, country}) => {
        dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: {fullname, address, city, postalcode, country} });
        Cookies.set("shippingAddress", JSON.stringify({fullname, address, city, postalcode, country}));
        router.push('/payment');
    };
    return (
      <Layouts title="Shipping Address">
        <CheckOutCart activeStep={1} />
        <form onSubmit={handleSubmit(submitHandler)} className={classess.form}>
          <Typography component="h1" variant="h1">
            Shipping Address
          </Typography>
          <List>
            <ListItem>
              <Controller
                name="fullname"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="fullname"
                    label="Full Name"
                    fullWidth
                    error={Boolean(errors.fullname)}
                    helperText={
                      errors.fullname
                        ? errors.fullname.type === "minLength"
                          ? "Full Name length is more than 1"
                          : "Full Name is required"
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 10,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="address"
                    label="Address"
                    fullWidth
                    error={Boolean(errors.address)}
                    helperText={
                      errors.address
                        ? errors.address.type === "minLength"
                          ? "Address length is more than 10"
                          : "Address is required"
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="city"
                    label="City"
                    fullWidth
                    error={Boolean(errors.city)}
                    helperText={
                      errors.city
                        ? errors.city.type === "minLength"
                          ? "City length is more than 2"
                          : "City is required"
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Controller
                name="postalcode"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="postalcode"
                    label="Postal Code"
                    fullWidth
                    error={Boolean(errors.postalcode)}
                    helperText={
                      errors.postalcode
                        ? errors.postalcode.type === "minLength"
                          ? "Postal Code length is more than 1"
                          : "Postal Code is required"
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    id="country"
                    label="Country"
                    fullWidth
                    error={Boolean(errors.country)}
                    helperText={
                      errors.country
                        ? errors.country.type === "minLength"
                          ? "Country length is more than 1"
                          : "Country is required"
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button variant="contained" type="submit" color="primary" fullWidth>
                continue
              </Button>
            </ListItem>
          </List>
        </form>
      </Layouts>
    );
  };
  
  export default Shipping;
  