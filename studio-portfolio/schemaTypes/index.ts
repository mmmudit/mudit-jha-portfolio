import { post } from "./post";
import { project } from "./project";
import { book } from "./book";
import { tune } from "./tune";
import { playItem } from "./playItem";
import { caseStudyBlockTypes } from "./caseStudyBlocks";

export const schemaTypes = [post, project, book, tune, playItem, ...caseStudyBlockTypes];
