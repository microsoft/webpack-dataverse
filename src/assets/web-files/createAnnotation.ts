import annotationIdMap from "./annotationIdMap";
import createRecord from "../../api/createRecord";
import createWebFile from "./createWebFile";
import getWebFileId from "./getWebFileId";

export default async function createAnnotation(
  fileName: string,
  content: string
): Promise<string> {
  let webFileId = await getWebFileId(fileName);
  if (!webFileId) {
    webFileId = await createWebFile(fileName);
  }
  const annotationId = await createRecord(
    "annotations",
    {
      "objectid_adx_webfile@odata.bind": `/adx_webfiles(${webFileId})`,
      isdocument: true,
      filename: fileName.replace(/\.js$/, ".es6"),
      documentbody: content,
    },
    "annotationid"
  );
  annotationIdMap[fileName] = Promise.resolve(annotationId);
  return annotationId;
}
