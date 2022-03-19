import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import React from "react";


const MOCKED_USERS = [
  {username: 'alice', password: 'alice123', email: 'alice@weyland.com', _id: "123"},
  {username: 'bob', password: 'bob234', email: 'bob@bigjeff.com', _id: "234"},
  {username: 'charlie', password: 'charlie345', email: 'charlie@bigjeff.com', _id: "345"},
]

const MOCKED_TUITS = [
  {_id: "100", postedBy: MOCKED_USERS[0], tuit: "alice's tuit"},
  {_id: "200", postedBy: MOCKED_USERS[1], tuit: "bob's tuit"},
  {_id: "300", postedBy: MOCKED_USERS[2], tuit: "charlie's tuit"}
];


test('tuit list renders static tuit array', () => {
    render(
        <HashRouter>
          <Tuits tuits={MOCKED_TUITS}/>
        </HashRouter>);
      const linkElement = screen.getByText(/alice's tuit/i);
      expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
    const testTuits = await findAllTuits();
      render(
        <HashRouter>
          <Tuits tuits={testTuits}/>
        </HashRouter>);
      const linkElement = screen.getByText(/Testing Tuit/i);
      expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
    const mock = jest.spyOn(axios, 'get');
      axios.get.mockImplementation(() =>
        Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
      const response = await findAllTuits();
      const tuits = response.tuits;

      render(
        <HashRouter>
          <Tuits tuits={tuits}/>
        </HashRouter>);

      const tuit = screen.getByText(/alice's tuit/i);
      expect(tuit).toBeInTheDocument();
      mock.mockRestore();
});




