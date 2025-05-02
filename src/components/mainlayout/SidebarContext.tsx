import React, { createContext, useContext } from "react";

export const SidebarContext = createContext({ expanded: false, setExpanded: (v: boolean) => {} });

export const useSidebar = () => useContext(SidebarContext); 