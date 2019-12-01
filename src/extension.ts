import * as vscode from 'vscode';
import * as utils from './utils';
import * as uuid from './modules/uuid';
import * as lorem from './modules/lorem';
import * as picsum from './modules/picsum';
import * as cases from './modules/cases';
import * as crypto from './modules/crypto';
import * as encode from './modules/encode';
import * as lines from './modules/lines';
import * as numberSeries from './modules/numberSeries';
import * as datetime from './modules/datetime';
import * as open from './modules/open';

let context: vscode.ExtensionContext;

const globalCommands: { [key: string]: () => any } = {
  'createIssue': () => utils.openUrl('https://github.com/datasert/vscode-texty/issues/new'),
};

const insertTextCommands: { [key: string]: () => undefined | string | Promise<string | undefined> } = {
  'insertDateTimeIsoString': datetime.getDateTimeIsoString,
  'insertDateIsoString': datetime.getDateIsoString,
  'insertShortId': uuid.generateShortId,
  'insertUuid': uuid.generateUuid,
  'insertUuidKey': uuid.generateUuidKey,
  'insertUuidNoDashes': uuid.generateUuidNoDashes,
  'insertLoremIpsumParagraph': () => lorem.generateLorem({ type: 'paragraph', count: 10 }),
  'insertLoremIpsumSentence': () => lorem.generateLorem({ type: 'sentence', count: 10 }),
  'insertLoremPicsum': async () => picsum.generatePicsum(await picsum.getPicsumOptions(context)),
  'insertLoremPicsumWithOptions': async () => picsum.generatePicsum(await picsum.getPicsumOptions(context, true)),
  'openFileInSystemDefaultApp': () => open.openFileInSystemDefaultApp(utils.getEditorFile()),
  'openFileInBrowser': async () => open.openFileInBrowser(utils.getEditorFile(), await open.getPreferredBrowser(false)),
  'openFileInBrowserPrompt': async () => open.openFileInBrowser(utils.getEditorFile(), await open.getPreferredBrowser(true)),
};

const processTextCommands: { [key: string]: (sels: string) => undefined | string | Promise<string | undefined>} = {
  'convertToLowerCase': cases.convertToLowerCase,
  'convertToUpperCase': cases.convertToUpperCase,
  'convertToCamelCase': cases.convertToCamelCase,
  'convertToPascalCase': cases.convertToPascalCase,
  'convertToSnakeCase': cases.convertToSnakeCase,
  'convertToKebabCase': cases.convertToKebabCase,
  'convertToConstantCase': cases.convertToConstantCase,
  'convertToDotCase': cases.convertToDotCase,
  'convertToPathCase': cases.convertToPathCase,
  'convertToSpaceCase': cases.convertToSpaceCase,
  'convertToCapitalCase': cases.convertToCapitalCase,
  'convertToSentenceCase': cases.convertToSentenceCase,
  'viewMd5Hash': crypto.viewMd5Hash,
  'encryptText': crypto.encryptTextWithPrompt,
  'decryptText': crypto.decryptTextWithPrompt,
  'urlEncode': encode.urlEncode,
  'urlDecode': encode.urlEncode,
  'htmlEncode': encode.htmlEncode,
  'htmlDecode': encode.htmlDecode,
  'xmlEncode': encode.xmlEncode,
  'xmlDecode': encode.xmlDecode,
  'base64Encode': encode.base64Encode,
  'base64Decode': encode.base64Decode,
  'jwtDecode': encode.jwtDecode,
  'sortLines': lines.sortLines,
  'sortLinesReverse': lines.sortLinesReverse,
  'sortLinesNatural': lines.sortLinesNatural,
  'sortLinesNaturalReverse': lines.sortLinesNaturalReverse,
  'sortLinesIgnoreCase': lines.sortLinesIgnoreCase,
  'sortLinesIgnoreCaseReverse': lines.sortLinesIgnoreCaseReverse,
  'sortLinesByLength': lines.sortLinesByLength,
  'sortLinesByLengthReverse': lines.sortLinesByLengthReverse,
  'sortLinesShuffle': lines.sortLinesShuffle,
  'removeDuplicates': lines.removeDuplicates,
  'removeDuplicatesIgnoreCase': lines.removeDuplicatesIgnoreCase,
  'removeBlankLines': lines.removeBlankLines,
  'removeBlankLinesSurplus': lines.removeBlankLinesSurplus,
  'splitByLength120': lines.splitLinesByLength120,
  'splitByLength80': lines.splitLinesByLength80,
  'splitByLength': lines.splitLinesByLengthPrompt,
  'splitBySentences': lines.splitBySentences,
  'translateUsingGoogle': line => utils.openUrl('https://translate.google.com/?q=' + line),
  'filterLinesContainsString': async sels => lines.filterLinesContainsString(sels, await lines.getInputSearchString()),
  'filterLinesNotContainsString': async sels => lines.filterLinesNotContainsString(sels, await lines.getInputSearchString()),
  'filterLinesContainsRegex': async sels => lines.filterLinesContainsRegex(sels, await lines.getInputSearchRegex()),
  'filterLinesNotContainsRegex': async sels => lines.filterLinesNotContainsRegex(sels, await lines.getInputSearchRegex()),
};

const processTextNewEditorCommands: { [key: string]: (sels: string) => undefined | string | Promise<string | undefined>} = {
  'filterLinesContainsStringNewEditor': async sels => lines.filterLinesContainsString(sels, await lines.getInputSearchString()),
  'filterLinesNotContainsStringNewEditor': async sels => lines.filterLinesNotContainsString(sels, await lines.getInputSearchString()),
  'filterLinesContainsRegexNewEditor': async sels => lines.filterLinesContainsRegex(sels, await lines.getInputSearchRegex()),
  'filterLinesNotContainsRegexNewEditor': async sels => lines.filterLinesNotContainsRegex(sels, await lines.getInputSearchRegex()),
};

const processTextsCommands: { [key: string]: (sels: string[]) => undefined | string[] | Promise<string[] | undefined>} = {
  'insertNumberSeriesFrom0': sels => numberSeries.generateFrom0(sels.length),
  'insertNumberSeriesFrom1': sels => numberSeries.generateFrom1(sels.length),
  'insertNumberSeriesWithOptions': async sels => numberSeries.generate(sels.length, await numberSeries.getOptions(context)),
  'insertDateSeriesWithOptions': async sels => numberSeries.generate(sels.length, await numberSeries.getOptions(context)),
  'convertDateTime': async sels => datetime.convertDateTime(sels, await datetime.getConvertTimeOptions(context)),
  'convertDateTimeToRelative': async sels => datetime.convertDateTimeToRelative(sels),
};

export function activate(extnContext: vscode.ExtensionContext) {
  context = extnContext;
  utils.setContext(context);

  for (const command of Object.keys(globalCommands)) {
    utils.registerCommand(context, command, globalCommands[command]);
  }

  for (const command of Object.keys(insertTextCommands)) {
    utils.registerInsertTextCommand(context, command, insertTextCommands[command]);
  }

  for (const command of Object.keys(processTextCommands)) {
    utils.registerProcessTextCommand(context, command, processTextCommands[command]);
  }

  for (const command of Object.keys(processTextNewEditorCommands)) {
    utils.registerProcessTextNewEditorCommand(context, command, processTextNewEditorCommands[command]);
  }

  for (const command of Object.keys(processTextsCommands)) {
    utils.registerProcessTextsCommand(context, command, processTextsCommands[command]);
  }
}

export function deactivate() { }
