import { SERVER_URL } from "../api-consumer";

export const BEAN_LEAF_NORMALIZER = 4624;

async function loadXml(path, tagName) {
    const response = await fetch(path);

    if (!response.ok) {
        console.error(
            `ERROR ${response.status}: ${response.statusText}, request: ${response.url}`
        );
        return [];
    }

    const fileText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(fileText, "text/xml");
    const errorNode = xml.querySelector("parsererror");

    if (errorNode) {
        console.error(
            `ERRO: falha ao tentar passar para xml o arquivo ${fileText}`,
            errorNode
        );
        return [];
    }

    const tag = xml.getElementsByTagName(tagName)[0];
    if (!tag) {
        alert(`ERRO: ${path} não tem tag <${tagName}>`);
        return [];
    }

    const children = tag.children;
    const points = [];
    for (let i = 0; i < children.length; i += 2) {
        const point = {
            x: parseFloat(children[i].textContent) * BEAN_LEAF_NORMALIZER,
            y: parseFloat(children[i + 1].textContent) * BEAN_LEAF_NORMALIZER,
        };
        points.push(point);
    }

    return points;
}

async function parseBeanLeaf(path, imageName) {
    const src = `${SERVER_URL}/datasets/${path}/${imageName}`;
    const xmlName = imageName.replace(".jpg", ".xml");
    const leafPath = `${SERVER_URL}/datasets/${path}/leaf/${xmlName}`;
    const markerPath = `${SERVER_URL}/datasets/${path}/marker/${xmlName}`;

    const markerPoints = await loadXml(markerPath, "corners");
    const leafPoints = await loadXml(leafPath, "points");
    return {
        src,
        annotations: [
            { class: "marker", points: markerPoints },
            { class: "leaf", points: leafPoints },
        ],
        filePath: src.split("datasets")[1],
    };
}

export const DefaultParser = { parseBeanLeaf };