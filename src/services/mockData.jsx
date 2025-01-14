
export const mockFolders = [
    { id: '1', name: 'Personal', createdAt: new Date().toISOString() },
    { id: '2', name: 'Work', createdAt: new Date().toISOString() },
  ];
  

  export const mockSeeds = [
    'apple banana cherry date elderberry fig grape kiwi lemon mango orange pear plum raspberry strawberry tomato watermelon',
  ];
  

  export const getRandomSeed = () => {
    return mockSeeds[Math.floor(Math.random() * mockSeeds.length)];
  };
  
   export const generateId = () => {
     return Math.random().toString(36).substr(2, 9);
   };//
  
  