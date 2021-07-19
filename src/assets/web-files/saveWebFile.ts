import createAnnotation from "./createAnnotation";
import getAnnotationId from "./getAnnotationId";
import updateRecord from "../../api/updateRecord";

export async function saveWebFile(fileName: string, content: string) {
  let annotationId = await getAnnotationId(fileName);
  if (!annotationId) {
    annotationId = await createAnnotation(fileName, content);
    console.log(`created ${fileName}`);
  } else {
    await updateRecord("annotations", annotationId, { documentbody: content });
    console.log(`updated ${fileName}`);
  }
}
