import { useState, useCallback, useEffect } from "react";
import type { SkillNodeData } from "@/components/ui/skill-node";

export interface SkillTreePath {
  id: string;
  title: string;
  description: string;
  nodes: SkillNodeData[];
  connections: Array<{ from: string; to: string }>;
}

export function useSkillTreeAnimation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] =
    useState<string>("prompt-engineering");
  const [animatingConnections, setAnimatingConnections] = useState<string[]>(
    []
  );
  const [pathTransitioning, setPathTransitioning] = useState(false);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNode(nodeId);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    // Enhanced node click handling with more detailed feedback
    console.log("Node clicked:", nodeId);

    // Could trigger lesson start, show detailed view, etc.
    // For now, just provide user feedback
    if (typeof window !== "undefined") {
      // Simple feedback for demo purposes
      const clickFeedback = () => {
        console.log(`Starting lesson: ${nodeId}`);
      };
      clickFeedback();
    }
  }, []);

  const switchPath = useCallback(
    (pathId: string) => {
      if (pathId === selectedPath) return;

      setPathTransitioning(true);
      setHoveredNode(null);

      // Animate path transition
      setTimeout(() => {
        setSelectedPath(pathId);
        setAnimatingConnections([]);

        // Trigger connection animations after path switch
        setTimeout(() => {
          setAnimatingConnections([
            "connection-1",
            "connection-2",
            "connection-3",
          ]);
          setPathTransitioning(false);
        }, 200);
      }, 100);
    },
    [selectedPath]
  );

  const getConnectionStatus = useCallback(
    (fromNode: SkillNodeData, toNode: SkillNodeData) => {
      // Enhanced connection logic
      const isCompleted = fromNode.status === "completed";
      const isActive =
        (fromNode.status === "completed" ||
          fromNode.status === "in-progress") &&
        toNode.status !== "locked";

      return { isActive, isCompleted };
    },
    []
  );

  // Add path transition animation effects
  useEffect(() => {
    if (pathTransitioning) {
      // Reset hover state during transition
      setHoveredNode(null);
    }
  }, [pathTransitioning]);

  // Simulate progressive connection animations when path loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatingConnections(["active"]);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedPath]);

  return {
    hoveredNode,
    selectedPath,
    animatingConnections,
    pathTransitioning,
    handleNodeHover,
    handleNodeClick,
    switchPath,
    getConnectionStatus,
  };
}
