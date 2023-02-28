import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@material-ui/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useContext, useState } from 'react'
import CheckOutCart from '../components/CheckOutCart'
import Layouts from '../components/Layouts'
import { Store } from '../utils/Store'
import useStyles from '../utils/styles'

export default function Payment() {
    const classes = useStyles()
    const { state, dispatch } = useContext(Store)
    const[paymentMethod, setPaymentMethod] = useState('')
    const { cart: {shippingAddress}} = state
    const router = useRouter()
    useEffect(() => {
        if(!shippingAddress.address){
            router.push('/shipping')
        }else{
            setPaymentMethod(Cookies.get('paymentMethod') || '')
        }
    }, [])
    const submitHandler = (e) => {
        e.preventDefault()
        if(!paymentMethod){
            alert('Payment method is required')
        }else{
            dispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod})
            Cookies.set('paymentMethod',paymentMethod)
            router.push('/placeorder')
        }
    }
  return (
    <Layouts title='Payment Method'>
        <CheckOutCart activeStep={2} />
        <form className={classes.form} onSubmit={submitHandler}>
            <Typography component='h1' variant='h1'>Paymeny Method</Typography>
            <List>
                <ListItem>
                    <FormControl component='fieldset'>
                        <RadioGroup aria-label='Payment Method' name='paymentMethod' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <FormControlLabel label='PayPal' value='PayPal' control={<Radio />} />
                            <FormControlLabel label='Stripe' value='Stripe' control={<Radio />} />
                            <FormControlLabel label='Cash' value='Cash' control={<Radio />} />
                        </RadioGroup>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <Button fullWidth type='submit' color='primary' variant='contained'>Continue</Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant='contained' onClick={() => router.push('/shipping')}>Back</Button>
                </ListItem>
            </List>
        </form>
    </Layouts>
  )
}
