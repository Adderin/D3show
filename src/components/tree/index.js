import React, { useState, useEffect, useRef } from "react";
import SmilesDrawer from "smiles-drawer";
import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import dotConvert from "graphlib-dot";
import { Container, ControlsBlock, GraphWrapper } from "./styled";
import { select } from "d3-selection";

const Tree = () => {
  const [dot] = useState(
  `digraph {\n\tCCC\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1"\n\tc1ccccc1\n\t"c1ccc(P(c2ccccc2)c2ccccc2)cc1"\n\t"c1ccc(Oc2ccccc2)cc1"\n\t"Cl[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t"Br[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t"[Li][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t"[K][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t"Cl[Sn](Cl)(Cl)Cl"\n\tCCC -> "c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" [label=0.78 rxn="c1ccc([SnH](c2ccccc2)c2ccccc2)cc1.CC(C)(C#N)N=NC(C)(C)C#N"]\n\tCCC -> c1ccccc1 [label=0.58 rxn="c1ccccc1.CCCI"]\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" -> "Cl[Sn](c1ccccc1)(c1ccccc1)c1ccccc1" [label=0.54 rxn="Cl[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"]\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" -> "Br[Sn](c1ccccc1)(c1ccccc1)c1ccccc1" [label=0.58 rxn="Br[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"]\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" -> "[Li][Sn](c1ccccc1)(c1ccccc1)c1ccccc1" [label=0.55 rxn="[Li][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"]\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" -> "[K][Sn](c1ccccc1)(c1ccccc1)c1ccccc1" [label=0.52 rxn="[K][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"]\n\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1" -> "Cl[Sn](Cl)(Cl)Cl" [label=0.64 rxn="Br[Mg]c1ccccc1.Cl[Sn](Cl)(Cl)Cl"]\n\tc1ccccc1 -> "c1ccc(P(c2ccccc2)c2ccccc2)cc1" [label=0.58 rxn="c1ccc(P(c2ccccc2)c2ccccc2)cc1"]\n\tc1ccccc1 -> "c1ccc(Oc2ccccc2)cc1" [label=0.66 rxn="c1ccc(Oc2ccccc2)cc1.Oc1ccccc1"]\n\t{\n\t\trank=same\n\t\tCCC\n\t}\n\t{\n\t\trank=same\n\t\t"c1ccc([SnH](c2ccccc2)c2ccccc2)cc1"\n\t\tc1ccccc1\n\t}\n\t{\n\t\trank=same\n\t\t"c1ccc(P(c2ccccc2)c2ccccc2)cc1"\n\t\t"c1ccc(Oc2ccccc2)cc1"\n\t\t"Cl[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t\t"Br[Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t\t"[Li][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t\t"[K][Sn](c1ccccc1)(c1ccccc1)c1ccccc1"\n\t\t"Cl[Sn](Cl)(Cl)Cl"\n\t}\n}` 
    );
  const [svg, setSvg] = useState(null);
  const [direction, setDirection] = useState("LR");

  const canvas = useRef(null);

  const makeNode = (node, params = {}) => {
    const color = params.fill ? params.fill : "rgba(245,245,200 ,0.6)";
    return {
      id: node,
      collapsed: false,
      label: `<canvas data-smiles=${node} width="250" height="100"></canvas>`,
      title: "Formula",
      labelType: "html",
      width: 300,
      height: 150,
      shape: "rect",
      style: `stroke: rgba(128,0,0,0.8); fill:${color}; stroke-width: 1px;`
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reDraw = file => {
    const digraph = dotConvert.read(file);
    const inner = svg.select("g");
    const render = new dagreD3.render();

    let g = new dagreD3.graphlib.Graph({
      directed: true,
      compound: true,
      multigraph: true
    });
    g.setGraph({});

    g.graph().rankdir = direction;
    g.graph().ranksep = 70;
    g.graph().nodesep = 70;

    digraph.nodes().forEach(el => {
      g.setNode(el, makeNode(el, undefined, 2));
    });

    digraph.edges().forEach(({ v, w }) => {
      let n = digraph.edge(v, w);

      g.setEdge(v, w, {
        label: n.label,
        style: "stroke: black; fill:none; stroke-width: 3px;",
        arrowheadStyle: "fill: red"
      });
    });

    g.nodes().forEach(el => {
      if (g.successors(el).length > 0) {
        g.setNode(el, makeNode(el, { fill: "rgba(107,142,45 ,0.6)" }, 2));
      }
    });

    const zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
    render(inner, g);
    SmilesDrawer.apply({ width: 300, height: 150 });
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.4));
  };

  useEffect(() => {
    setSvg(select(canvas.current));
  }, []);

  useEffect(() => {
    if (dot && svg) {
      reDraw(dot);
    }
  }, [dot, svg, direction, reDraw]);

  return (
    <Container>
      <ControlsBlock>
        <button onClick={() => setDirection(n => (n === "LR" ? "TB" : "LR"))}>
          Toggle graph
        </button>
      </ControlsBlock>
      <GraphWrapper>
        <svg width={window.innerWidth} height={window.innerHeight} ref={canvas}>
          <g />
        </svg>
      </GraphWrapper>
    </Container>
  );
};

export default Tree;