import nc from 'next-connect'
import Product from '../../../modals/Products'
import db from '../../../utils/db'
const handler = nc()

handler.get( async(req, res) => {
    await db.connect()
    const products = await Product.find({})
    res.send(products)
    await db.disconnect()
})

export default handler