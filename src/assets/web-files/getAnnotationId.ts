import annotationIdMap from "./annotationIdMap";
import getRecords from "../../api/getRecords";
import getWebFileId from "./getWebFileId";
import { Annotation } from "../tables";

export default function getAnnotationId(
  fileName: string
): Promise<string | undefined> {
  if (!(fileName in annotationIdMap)) {
    annotationIdMap[fileName] = getAnnotationIdInternal();
  }
  return annotationIdMap[fileName];

  async function getAnnotationIdInternal(): Promise<string | undefined> {
    const webFileId = await getWebFileId(fileName);
    if (!webFileId) {
      return undefined;
    }
    const annotations = await getRecords<Annotation>(
      "/annotations?" +
        "$select=annotationid&" +
        `$filter=_objectid_value eq ${webFileId} and isdocument eq true`
    );
    return annotations[0]?.annotationid;
  }
}
