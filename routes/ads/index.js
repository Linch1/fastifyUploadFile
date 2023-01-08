'use strict'

const { uploadImage } = require("../../db/multer");
const Services = require("../../db/services")


module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    console.log( 'Services', Services );
    let images = await Services.ads.find();
    reply.send(images);
  });

  fastify.post('/', { preHandler: uploadImage }, (req, res) => {
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
          name: req.file.filename,
          id: req.file.id
        }
    }
    res.send(obj);
});
}
