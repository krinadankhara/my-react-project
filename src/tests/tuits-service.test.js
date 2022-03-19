import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";

import {
  findAllTuits,
  findTuitById, findTuitByUser, createTuit,
  updateTuit, deleteTuit, deleteTuitsByTuitname
} from "../services/tuits-service";

describe('can create tuit with REST API', () => {

    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
      };

    const testTuit = {
        tuit: "Testing Tuit"
    };

     // setup before running test
      beforeAll(async() => {
        // clean up before the test making sure the user doesn't already exist
        await deleteUsersByUsername(ripley.username);
        await deleteTuitsByTuitname(testTuit.tuit);
      });

      // clean up after ourselves
      afterAll(async() => {
        // remove any data we inserted
        await deleteUsersByUsername(ripley.username);
        await deleteTuitsByTuitname(testTuit.tuit);
      });

    test('can insert new tuits with REST API', async () => {
           const newUser = await createUser(ripley);
           const newTuit = await createTuit(newUser._id, testTuit);
           expect(newTuit.tuit).toEqual(testTuit.tuit);

    })
});

describe('can delete tuit with REST API', () => {
    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    const testTuit = {
        tuit: "Testing Tuit"
    };

    beforeAll(async() => {
        await deleteUsersByUsername(ripley.username);
    });

    afterAll(async() => {
        await deleteUsersByUsername(ripley.username);
    });

    test('can delete tuit with REST API', async () => {
        const newUser = await createUser(ripley);
        const newTuit = await createTuit(newUser._id, testTuit);
        const deleteTuitTest = await deleteTuit(newTuit._id);
        expect(deleteTuitTest.deletedCount).toBeGreaterThanOrEqual(1);

    })
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    const testTuit = {
        tuit: "Testing Tuit"
    };

    beforeAll(async() => {
        await deleteUsersByUsername(ripley.username);
    });

    afterAll(async() => {
        await deleteUsersByUsername(ripley.username);
    });

    test('can retrieve a tuit by their primary key with REST API', async () => {
            const newUser = await createUser(ripley);
            const newTuit = await createTuit(newUser._id, testTuit);
            const findTuit = await findTuitById(newTuit._id);

            expect(findTuit.tuit).toEqual(newTuit.tuit)
            expect(findTuit._id).toEqual(newTuit._id)
            expect(findTuit.postedBy._id).toEqual(newUser._id)
     })

});

describe('can retrieve all tuits with REST API', () => {
    // sample users we'll insert to then retrieve

    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    const tuits = [
        "Testing Tuit 1", "Testing Tuit 2", "Testing Tuit 3"
    ];


      beforeAll(async () => {
        const newUser = await createUser(ripley);
        for(let i =0; i < tuits.length; i++){
               await createTuit(newUser._id, {tuit:tuits[i]})
         }
      });

      afterAll(async () => {
        await deleteUsersByUsername(ripley.username)
        for(let i =0; i < tuits.length; i++){
            await deleteTuitsByTuitname(tuits[i])
            }
        }
      );

      test('can retrieve all users from REST API', async () => {

      const allTuits = await findAllTuits();

      expect(allTuits.length).toBeGreaterThanOrEqual(tuits.length);

      const tuitsWeInserted = allTuits.filter(
              tuit => tuits.indexOf(tuit.tuit) >= 0);

      tuitsWeInserted.forEach(tuit => {
              const theTuit = tuits.find(x => x === tuit.tuit);
              expect(tuit.tuit).toEqual(theTuit);

        });
      });
});