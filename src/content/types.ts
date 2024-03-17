
type ContentFields = {
    [key: string]: ContentField;
  };

export interface Content {
    fields: ContentFields
}

interface ContentField {
  nodeType: string

}

export interface ContentDocument extends ContentField {
  content: ContentField[]
}

export interface ContentParagraphField extends ContentField {
  content: ContentField[]
}

export interface TextField extends ContentField {
  value: string
}

export function isFieldDocument(
  field: ContentField
): field is ContentDocument {
  return field.nodeType == "document"
}

export function isFieldParagraph(
  field: ContentField
): field is ContentParagraphField {
  return field.nodeType == "paragraph"
}

export function isFieldText(
  field: ContentField
): field is TextField {
  return field.nodeType == "text"
}