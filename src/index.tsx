import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewsList } from "./pages/news-list/NewsList";
import { newsListStore } from "./stores/news-list.store";
import { Provider } from "mobx-react";
import 'semantic-ui-css/semantic.min.css'
import { NewsPage } from "./pages/news-page/NewsPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider newsListStore={newsListStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
