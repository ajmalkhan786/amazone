import { Button, Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import NextLink from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContext } from "react";
import CheckOutCart from "../components/CheckOutCart";
import Layouts from "../components/Layouts";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";

const Placeorder = () => {
    const router = useRouter()
    const classes = useStyles()
    const {state, dispatch} = useContext(Store)
    const {cart: {cartItems, shippingAddress, paymentMethod}, user: {userInfo}} = state
    const round2 = (num)=> Math.round(num * 100 + Number.EPSILON)/100 //convert decimal into 2 digit
    const itemPrice =  round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0))
    const shippingPrice = itemPrice > 200 ? 0 : 15
    const taxPrice = round2(itemPrice * 0.15)
    const totalPrice = round2(itemPrice + shippingPrice + taxPrice)
    
    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment')
        }
        if(cartItems.length == 0){
            router.push('/cart')
        }
    }, [])
    const[loading, setLoading] = useState(false)
    const placeOrderHandler = async() => {
        try {
            setLoading(true)
            const {data} = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemPrice,
                shippingPrice,
                taxPrice,totalPrice
            },{
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({type: 'CART_CLEAR'})
            Cookies.remove('cartItems')
            setLoading(false)
            router.push( `/order/${data._id}`)
        } catch (error) {
            setLoading(false)
            alert(error.message);
        }
    }
    
    return (
        <Layouts title='Place Order'>
            <CheckOutCart activeStep={3} />
            <Typography component='h1' variant="h1">Place Order</Typography>
                <Grid container spacing={2}>
                    <Grid item md={9} xs={12} sm={8}>
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography>Shipping Address</Typography>
                                </ListItem>
                                <ListItem>
                                    {shippingAddress.fullname}, {shippingAddress.address}, {' '}, 
                                    {shippingAddress.city}, {shippingAddress.postalcode}, {' '}
                                    {shippingAddress.country}
                                </ListItem>
                            </List>
                        </Card>
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography>Payment Method</Typography>
                                </ListItem>
                                <ListItem>
                                    {paymentMethod}
                                </ListItem>
                            </List>
                        </Card>
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component='h2' variant="h2">Oredr Item</Typography>
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
                                                {cartItems.map((item) => (
                                                    <TableRow key={item._id}>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
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
                                    <Typography variant="h2">
                                        Order Summary
                                    </Typography>
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
                                            <Typography><strong>Total:</strong></Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right"><strong>${totalPrice}</strong></Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" color='primary' fullWidth onClick={placeOrderHandler}>Place Order</Button>
                                </ListItem>
                                {loading && <ListItem><CircularProgress></CircularProgress></ListItem>}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
        </Layouts> 
     );
}
 
export default dynamic(() => Promise.resolve(Placeorder), { ssr: false });