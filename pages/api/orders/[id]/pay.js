import nc from 'next-connect'
import db from '../../../../utils/db'
import { isAuth } from '../../../../utils/auth'
import { onError } from '../../../../utils/error'
import Order from '../../../../modals/Order'

const handler = nc({onError})
handler.use(isAuth)

handler.put( async(req, res) => {
    await db.connect()
    const order = await Order.findById(req.query.id)
    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address
        }
        const paidOrder = await order.save()
        res.send({message: 'order paid', order: paidOrder})
        await db.disconnect()
    }else{
        res.status(404).send({message: 'order not found'})
        await db.disconnect()
    }
})

export default handler