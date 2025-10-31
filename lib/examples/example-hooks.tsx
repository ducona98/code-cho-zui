import { useEffect, useRef, useState } from "react";
import {
  useAsync,
  useAxios,
  useClickOutside,
  useDebounce,
  useLocalStorage,
  useMediaQuery,
  useToggle,
  useWindowSize,
} from "../hooks";

// Example: useLocalStorage
export function ExampleLocalStorage() {
  const [token, setToken, removeToken] = useLocalStorage<string>("token", "");

  return (
    <div>
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token"
      />
      <button onClick={removeToken}>Clear Token</button>
    </div>
  );
}

// Example: useDebounce
export function ExampleDebounce() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Make API call with debounced value
  useEffect(() => {
    if (debouncedSearch) {
      console.log("Searching for:", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Example: useWindowSize
export function ExampleWindowSize() {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}

// Example: useClickOutside
export function ExampleClickOutside() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(true)}>Open Dropdown</button>
      {isOpen && <div>Dropdown Content</div>}
    </div>
  );
}

// Example: useAxios
export function ExampleAxios() {
  const { data, loading, error, execute, reset } = useAxios<User[]>(
    { url: "/users" },
    { manual: true }
  );

  return (
    <div>
      <button onClick={() => execute()}>Fetch Users</button>
      <button onClick={reset}>Reset</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Users: {JSON.stringify(data)}</div>}
    </div>
  );
}

// Example: useMediaQuery
export function ExampleMediaQuery() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return (
    <div>
      {isMobile && <div>Mobile View</div>}
      {isTablet && <div>Tablet View</div>}
      {isDesktop && <div>Desktop View</div>}
    </div>
  );
}

// Example: useAsync
export function ExampleAsync() {
  const fetchData = async () => {
    const response = await fetch("/api/data");
    return response.json();
  };

  const { data, loading, error, execute } = useAsync(fetchData, false);

  return (
    <div>
      <button onClick={() => execute()}>Fetch Data</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}

// Example: useToggle
export function ExampleToggle() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <button onClick={() => setIsOpen(false)}>Close</button>
      {isOpen && <div>Content is open!</div>}
    </div>
  );
}

// Type for example
interface User {
  id: number;
  name: string;
  email: string;
}
