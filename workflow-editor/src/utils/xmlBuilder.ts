/**
 * XML Builder Utility
 * Provides helper functions to build XML strings for BPMN 2.0 format
 */

/**
 * Escapes special XML characters
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds XML attributes string from object
 */
export function buildAttributes(attrs: Record<string, string | number | boolean | undefined>): string {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}="${escapeXml(String(value))}"`)
    .join(' ');
}

/**
 * Creates an XML element with attributes and optional content
 */
export function createElement(
  tagName: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
  content?: string,
  indent = 0
): string {
  const indentation = '  '.repeat(indent);
  const attrsString = buildAttributes(attributes);
  const attrsWithSpace = attrsString ? ` ${attrsString}` : '';
  
  if (content !== undefined && content !== '') {
    return `${indentation}<${tagName}${attrsWithSpace}>${content}</${tagName}>`;
  } else if (content === '') {
    // Self-closing tag for empty content
    return `${indentation}<${tagName}${attrsWithSpace} />`;
  } else {
    // Self-closing tag for no content
    return `${indentation}<${tagName}${attrsWithSpace} />`;
  }
}

/**
 * Creates an XML element with child elements
 */
export function createElementWithChildren(
  tagName: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
  children: string[],
  indent = 0
): string {
  const indentation = '  '.repeat(indent);
  const attrsString = buildAttributes(attributes);
  const attrsWithSpace = attrsString ? ` ${attrsString}` : '';
  
  if (children.length === 0) {
    return `${indentation}<${tagName}${attrsWithSpace} />`;
  }
  
  const childrenStr = children.join('\n');
  return `${indentation}<${tagName}${attrsWithSpace}>\n${childrenStr}\n${indentation}</${tagName}>`;
}

/**
 * Creates BPMN XML header
 */
export function createBpmnHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>`;
}

/**
 * Creates BPMN definitions element with namespaces
 */
export function createBpmnDefinitions(children: string[]): string {
  const attrs = {
    'xmlns': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    'xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
    'xmlns:omgdc': 'http://www.omg.org/spec/DD/20100524/DC',
    'xmlns:omgdi': 'http://www.omg.org/spec/DD/20100524/DI',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'id': 'Definitions_1',
    'targetNamespace': 'http://bpmn.io/schema/bpmn',
    'exporter': 'Workflow Visual Editor',
    'exporterVersion': '1.0'
  };
  
  return createElementWithChildren('definitions', attrs, children, 0);
}

/**
 * Pretty formats XML string with proper indentation
 */
export function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const lines = xml.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Decrease indent for closing tags
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1);
    }
    
    formatted += '  '.repeat(indent) + trimmed + '\n';
    
    // Increase indent for opening tags (but not self-closing)
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.startsWith('<?')) {
      indent++;
    }
  });
  
  return formatted.trim();
}

/**
 * Validates basic XML structure
 */
export function validateXmlStructure(xml: string): { valid: boolean; error?: string } {
  try {
    // Check for basic XML structure
    if (!xml.includes('<?xml')) {
      return { valid: false, error: 'Missing XML declaration' };
    }
    
    if (!xml.includes('<definitions')) {
      return { valid: false, error: 'Missing BPMN definitions element' };
    }
    
    // Count opening and closing tags
    const openTags = xml.match(/<[^/][^>]*[^/]>/g)?.length || 0;
    const closeTags = xml.match(/<\/[^>]+>/g)?.length || 0;
    const selfClosingTags = xml.match(/<[^>]+\/>/g)?.length || 0;
    
    if (openTags !== closeTags + selfClosingTags) {
      return { valid: false, error: 'Mismatched XML tags' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: String(error) };
  }
}
