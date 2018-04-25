import React from 'react';
import AddChapter from "./AddChapter";
import ChapterCard from "./ChapterCard";
import pics from "./pics.json";

const Journal = () => (
  <div>
    <h1>Journal</h1>
    <AddChapter />
    <ChapterCard />
  </div>
);

export default Journal;
