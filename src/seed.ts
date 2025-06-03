import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function seedApi() {
  console.log(`Starting API seeding using ${API_URL}...`);

  try {
    // Seed Restaurants
    const restaurants = [];
    console.log('Creating 5 restaurants...');
    for (let i = 0; i < 5; i++) {
      const restaurantData = {
        name: faker.company.name() + ' Restaurant',
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email().toLowerCase(),
        logoUrl: faker.image.url({ width: 200, height: 200 }),
        subscriptionStatus: faker.helpers.arrayElement(['free', 'basic', 'premium']),
      };
      const response = await axios.post(`${API_URL}/restaurants`, restaurantData);
      restaurants.push(response.data.data);
      console.log(`Created restaurant: ${response.data.data.name}`);
    }

    // Seed Menus and Categories for each restaurant
    for (const restaurant of restaurants) {
      console.log(`Seeding menus and categories for ${restaurant.name}...`);
      
      // Create Menus
      const menus = [];
      const numMenus = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < numMenus; i++) {
        const menuData = {
          name: `${restaurant.name} ${faker.commerce.productAdjective()} Menu`,
          description: faker.commerce.productDescription(),
          isActive: faker.datatype.boolean(),
          restaurantId: restaurant.id,
        };
        const response = await axios.post(`${API_URL}/menus`, menuData);
        menus.push(response.data.data);
        console.log(`  Created menu: ${response.data.data.name}`);
      }

      // Create Categories for each menu
      for (const menu of menus) {
        const categories = [];
        const numCategories = faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < numCategories; i++) {
          const categoryData = {
            name: faker.commerce.department(),
            description: faker.lorem.sentence(),
            order: i,
            menuId: menu.id,
          };
          const response = await axios.post(`${API_URL}/categories`, categoryData);
          categories.push(response.data.data);
          console.log(`    Created category: ${response.data.data.name} in menu ${menu.name}`);
        }

        // Seed Menu Items for each category
        for (const category of categories) {
          const menuItems = [];
          const numMenuItems = faker.number.int({ min: 3, max: 10 });
          console.log(`      Creating ${numMenuItems} menu items for category ${category.name}...`);
          for (let i = 0; i < numMenuItems; i++) {
            const menuItemData = {
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              price: faker.number.float({ min: 1, max: 30, fractionDigits: 2 }),
              isAvailable: faker.datatype.boolean(),
              imageUrl: faker.image.url({ width: 200, height: 200 }),
              order: i,
              categoryId: category.id,
            };
            const response = await axios.post(`${API_URL}/menu-items`, menuItemData);
            menuItems.push(response.data.data);
            console.log(`        Created menu item: ${response.data.data.name}`);
          }

          // Seed Option Groups and Options for each menu item
          for (const menuItem of menuItems) {
            const numOptionGroups = faker.number.int({ min: 0, max: 3 });
            if (numOptionGroups > 0) {
               console.log(`        Creating ${numOptionGroups} option groups for menu item ${menuItem.name}...`);
            }
           
            for (let i = 0; i < numOptionGroups; i++) {
              const isMulti = faker.datatype.boolean();
              const minSel = isMulti ? faker.number.int({ min: 0, max: 2 }) : 1;
              const maxSel = isMulti ? faker.number.int({ min: minSel, max: 4 }) : 1;

              const optionGroupData = {
                name: faker.word.words({ count: { min: 1, max: 3 } }) + ' Options',
                isMultiSelect: isMulti,
                minSelections: minSel,
                maxSelections: maxSel,
                order: i,
                menuItemId: menuItem.id,
              };
              const response = await axios.post(`${API_URL}/option-groups`, optionGroupData);
              const optionGroup = response.data.data;
              console.log(`          Created option group: ${optionGroup.name}`);

              // Seed Options for each option group
              const numOptions = faker.number.int({ min: 2, max: 5 });
              console.log(`          Creating ${numOptions} options for option group ${optionGroup.name}...`);
              for (let j = 0; j < numOptions; j++) {
                const optionData = {
                  name: faker.word.words({ count: { min: 1, max: 2 } }),
                  priceAdjustment: faker.number.float({ min: -5, max: 10, fractionDigits: 2 }),
                  isAvailable: faker.datatype.boolean(),
                  optionGroupId: optionGroup.id,
                };
                const optionResponse = await axios.post(`${API_URL}/options`, optionData);
                console.log(`            Created option: ${optionResponse.data.data.name}`);
              }
            }
          }
        }
      }
    }

    console.log('API seeding finished successfully.');

  } catch (error: any) {
    console.error('Error during API seeding:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    process.exit(1);
  }
}

seedApi();
