import { Box, Button, Card, Grid, Link, List, ListItem, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import NextLink from 'next/link'
import { useRouter } from "next/router";
import { useContext } from "react";
import Layouts from "../components/Layouts";
import { Store } from "../utils/Store";

const Cart = () => {
    const {state, dispatch} = useContext(Store)
    const {cart: {cartItems}, user: {userInfo}} = state
    const router = useRouter()
    const { redirect } = router.query;
    const handleUpdateCart = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`)
        if(data.countInStock <= 0){
            window.alert('Sorry. Product is out of stock.')
            return
        }
        dispatch({ type: 'ADD_CART_ITEM', payload: { ...item, quantity } })
    }
    const handleDeleteItem = (item) => {
        dispatch( { type: 'DELETE_CART_ITEM', payload: item } )
    }
    const handleCheckout = () => {
        if(!userInfo){
            router.push(redirect || '/login')
        }else{
            router.push('/shipping')
        }
    }
    return (
        <Layouts title='Shopping Cart'>
            <Typography component='h1' variant="h1">Shopping Cart</Typography>
            {cartItems.length === 0 ? (<Box>Cart is empty. <NextLink href='/' passHref><Link>Go Shopping</Link></NextLink></Box>):
                (
                    <Grid container spacing={2}>
                        <Grid item md={9} xs={12} sm={8}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Action</TableCell>
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
                                                <TableCell align="right">
                                                    <Select value={item.quantity} onChange={(e) => handleUpdateCart(item, e.target.value)}>
                                                        {[...Array(item.countInStock).keys()].map((x)=> (
                                                            <MenuItem key={x+1} value={x+1}>{x+1}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="right">${item.price}</TableCell>
                                                <TableCell align="right">
                                                    <Button variant="contained" color='secondary' onClick={()=> handleDeleteItem(item)}>x</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item md={3} sm={4} xs={12}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Typography variant="h2">
                                            SubTotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} { ' '}items):
                                            ${} 
                                            {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="contained" color='primary' fullWidth onClick={handleCheckout}>Check Out</Button>
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                )
            }
        </Layouts> 
     );
}
 
export default dynamic(() => Promise.resolve(Cart), { ssr: false });