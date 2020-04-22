
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fruits').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('fruits').insert([
        {name: 'dragon fruit', avgWeightOz: 2.0, delicious: true, color:'pink'},
        {name: 'mangoteen', avgWeightOz: 3.5, delicious: true, color:'purple'},
        {name: 'papaya', avgWeightOz: 122.4, delicious: false, color:'orange'},
        
      ]);
    });
};
