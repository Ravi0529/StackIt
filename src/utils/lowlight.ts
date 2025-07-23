import { createLowlight, all } from "lowlight";

import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";

const lowlight = createLowlight(all);

lowlight.register("js", javascript);
lowlight.register("javascript", javascript);
lowlight.register("ts", typescript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("json", json);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("c", c);
lowlight.register("sql", sql);
lowlight.register("xml", xml);

export default lowlight;
