const Dev = require('../models/Dev');
const string_to_array = require('../utils/string_to_array');

module.exports = {

    async index(request, response){

        console.log(request.query);

        const { latitude, longitude, techs } = request.query;

        const techs_array = string_to_array(techs);

        const devs = await Dev.find({
            techs: {
                $in: techs_array,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude,latitude],
                    },
                    $maxDistance: 100000,
                },
            },
        });

        return response.json({devs});
    },
};