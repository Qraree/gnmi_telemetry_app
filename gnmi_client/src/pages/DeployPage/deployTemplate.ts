export const deployTemplate = {
  topologyContent: {
    name: "hello2",
    topology: {
      kinds: {
        arista_ceos: {
          image: "ceos:4.33.2F",
        },
      },
      nodes: {
        ceos1: {
          kind: "arista_ceos",
        },
        ceos2: {
          kind: "arista_ceos",
        },
      },
      links: [
        {
          endpoints: ["ceos1:eth1", "ceos2:eth1"],
        },
      ],
    },
  },
};
