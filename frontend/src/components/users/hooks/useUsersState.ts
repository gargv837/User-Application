export type UsersState = {
  editId: number | null;
  page: number;
  limit: number;
  search: string;
};

export type UsersAction =
  | { type: "setEditId"; id: number | null }
  | { type: "setPage"; page: number }
  | { type: "setLimit"; limit: number }
  | { type: "setSearch"; search: string };

export const initialState: UsersState = {
  editId: null,
  page: 1,
  limit: 5,
  search: "",
};

export function reducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case "setEditId":
      return { ...state, editId: action.id };
    case "setPage":
      return { ...state, page: action.page };
    case "setLimit":
      return { ...state, limit: action.limit };
    case "setSearch":
      return { ...state, search: action.search };
    default:
      return state;
  }
}

