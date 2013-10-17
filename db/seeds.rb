require 'faker'

10.times do 
  User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, age: rand(18..65))
end