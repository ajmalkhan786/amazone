import {  Button, Card, Grid, Link, List, ListItem, Typography } from '@material-ui/core'
import dynamic from 'next/dynamic'
import React from 'react'
import Layouts from '../../components/Layouts'
import NextLink from 'next/link'
import useStyles from '../../utils/styles'
import Image from 'next/image'
import db from '../../utils/db'
import Product from '../../modals/Products'
import axios from 'axios'
import { useContext } from 'react'
import { Store } from '../../utils/Store'
import { useRouter } from 'next/router'

function ProducDetail(props) {
    const { state, dispatch} = useContext(Store )
    const { product } = props
    const classes = useStyles()
    const router = useRouter()
    // const router = useRouter()
    // // console.log('query',router.query)
    // const { slug } = router.query
    // // console.log(slug)
    // const product = data.products.find(a => a.slug === slug)
    // // console.log(product)
    if (!product) {
        return <h1>Product not found.</h1>
    }
    const handleAddToCart = async () => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`)
        if(data.countInStock < quantity){
            window.alert('Sorry. Product is out of stock.')
            return
        }
        dispatch({ type: 'ADD_CART_ITEM', payload: { ...product, quantity } })
        router.push('/cart')
    }
  return (
    <Layouts title={product.name} description={product.description}>
        <NextLink href='/' passHref>
            <Link>
                <Typography className={classes.section}>Back to products</Typography>
            </Link>
        </NextLink>
        <Grid container spacing={1}>
            <Grid item md={6} sm={4} xs={12}>
                <Image src={product.image} alt={product.name} width={640} height={500} layout='intrinsic' />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
                <List>
                    <ListItem>
                        <Typography  component='h1' variant='h1'>{product.name}</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>Category: {product.category}</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>Rating: {product.rating} stars ({product.numReviews} reviews)</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>Description: {product.description}</Typography>
                    </ListItem>
                </List>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
                <Card>
                    <List>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Price</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>${product.price}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Status</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{product.countInStock>0? 'In Stock' : 'Out of stock'}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Button fullWidth variant='contained' color='primary' onClick={handleAddToCart}>
                                Add to cart
                            </Button>
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    </Layouts>
  )
}


export async function getServerSideProps(context) {
    const { params } = context
    const { slug } = params
    await db.connect()
    const product = await Product.findOne({ slug }).lean()
    await db.disconnect()
    return {
      props: {
        product: db.convertDocToObj(product),
      },
    }
}

export default dynamic(() => Promise.resolve(ProducDetail), {ssr: false})