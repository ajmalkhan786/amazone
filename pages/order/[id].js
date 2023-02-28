import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useContext } from "react";
import CheckOutCart from "../../components/CheckOutCart";
import Layouts from "../../components/Layouts";
import { Store } from "../../utils/Store";
import useStyles from "../../utils/styles";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true};
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, errorPay: '', successPay: false };
    default:
      state;
  }
}

const Order = ({ params }) => {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const classes = useStyles();
  const { state } = useContext(Store);
  const {
    user: { userInfo },
  } = state;
  const [{ loading, error, order, successPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    totalPrice,
    shippingPrice,
    itemPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = order;

  console.log('paidAt', order)

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if(successPay) {
        dispatch({type: 'PAY_RESET'})
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD", 
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript()
    }
  }, [order, successPay]);
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove (data, actions) {
    return actions.order.capture().then(async function (details) {
        try {
           dispatch({type: 'PAY_REQUSET'}) 
           const {data} = axios.put(`api/orders/${order._id}/pay`,
           details,
           {
            headers: {authorization : `Bearer ${userInfo.token}`}
           })
           dispatch({type: 'PAY_SUCCESS', payload: data})
           alert('Order is paid')
        } catch (error) {
          dispatch({type: 'PAY_FAIL', payload: error.message})
          alert(error.message)
        }
    })
  }
  function onError (error) {
    alert(error.message)
  }
  return (
    <Layouts title={`Order ${orderId}`}>
      <CheckOutCart activeStep={3} />
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={9} xs={12} sm={8}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography>Shipping Address</Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullname}, {shippingAddress.address}, ,
                  {shippingAddress.city}, {shippingAddress.postalcode},{" "}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{" "}
                  {isDelivered
                    ? `Delivered at ${deliveredAt}`
                    : "Not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography>Payment Method</Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `Paid at ${paidAt}` : "Not paid"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Oredr Item
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>name</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} sm={4} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${itemPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <Box className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </Box>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layouts>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
