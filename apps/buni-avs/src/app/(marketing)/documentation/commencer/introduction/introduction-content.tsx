export const IntroductionContent = {
  Why: () => (
    <p>
      La plupart des design systems actuels sont basés sur des esthétiques occidentales. AVS change la donne en proposant
      une identité visuelle authentiquement africaine, documentée et accessible à tous les développeurs.
    </p>
  ),
  Explanation: () => (
    <>
      <p>
        AVS adopte l&apos;approche <strong>Copy &amp; Paste</strong> popularisée par Shadcn/UI : vous copiez les composants
        dans votre projet, ils vous appartiennent entièrement. Pas de dépendance opaque, pas de lock-in.
      </p>
      
      <h3>Philosophie</h3>
      <ul>
        <li><strong>Culturellement ancré</strong> — Chaque token de couleur, motif et composant est documenté avec sa source primaire africaine.</li>
        <li><strong>Public par défaut</strong> — Composants, motifs, templates — tout est accessible sans authentification.</li>
        <li><strong>Copy &amp; Paste</strong> — Vous possédez votre code. Aucune dépendance lourde. Adaptez, étendez, supprimez.</li>
        <li><strong>Design System cohérent</strong> — Palette extraite de pigments naturels africains, tokens CSS, motifs CSS pur.</li>
      </ul>

      <h3>Comparaison avec PrimeReact</h3>
      <table className="w-full text-xs border border-avs-accent/9">
        <thead>
          <tr className="bg-avs-primary/10">
            <th className="px-4 py-2 text-left font-bold">Fonctionnalité</th>
            <th className="px-4 py-2 text-center font-bold">AVS</th>
            <th className="px-4 py-2 text-center font-bold">PrimeReact</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-avs-accent/9">
            <td className="px-4 py-2">Accès sans compte</td>
            <td className="px-4 py-2 text-center"><i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} /></td>
            <td className="px-4 py-2 text-center"><i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} /></td>
          </tr>
          <tr className="border-t border-avs-accent/9">
            <td className="px-4 py-2">Copy &amp; Paste</td>
            <td className="px-4 py-2 text-center"><i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} /></td>
            <td className="px-4 py-2 text-center"><i className="pi pi-times text-red-500" style={{ fontSize: '12px' }} /></td>
          </tr>
          <tr className="border-t border-avs-accent/9">
            <td className="px-4 py-2">Design africain</td>
            <td className="px-4 py-2 text-center"><i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} /></td>
            <td className="px-4 py-2 text-center"><i className="pi pi-times text-red-500" style={{ fontSize: '12px' }} /></td>
          </tr>
          <tr className="border-t border-avs-accent/9">
            <td className="px-4 py-2">Motifs CSS</td>
            <td className="px-4 py-2 text-center"><i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} /></td>
            <td className="px-4 py-2 text-center"><i className="pi pi-times text-red-500" style={{ fontSize: '12px' }} /></td>
          </tr>
        </tbody>
      </table>
    </>
  ),
};
