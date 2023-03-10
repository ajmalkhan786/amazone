import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Link, Typography } from "@material-ui/core";
import Layouts from "../components/Layouts";
import NextLink from 'next/link'
import db from "../utils/db";
import Product from "../modals/Products";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "../utils/Store";

export default function Home(props) {
  const {products} = props
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  const handleAddToCart = async (product) => {
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
      <Layouts>
        <div>
          <h1>Products</h1>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} sm={4} xs={12} key={product.name}>
                <Card>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <Link>  
                      <CardActionArea>
                        <CardMedia component='img' image={product.image} title={product.name}></CardMedia>
                        <CardContent>
                          <Typography>{product.name}</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </NextLink>
                  <CardActions>
                    <Typography>${product.price}</Typography>
                    <Button size="small" color="primary" onClick={() => handleAddToCart(product)}>Add to cart</Button>
                    </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Layouts>
  )
}



export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}).lean()
  await db.disconnect()
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  }
}