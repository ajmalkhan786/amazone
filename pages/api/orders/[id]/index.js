import nc from 'next-connect'
import db from '../../../../utils/db'
import { isAuth } from '../../../../utils/auth'
import Order from '../../../../modals/Order'

const handler = nc()
handler.use(isAuth)

handler.get( async(req, res) => {
    await db.connect()
    const order = await Order.findById(req.query.id)
    res.send(order)
    await db.disconnect()
})

export default handler