# Instructions pour l'intégration des styles personnalisés

Pour intégrer les nouveaux styles CSS, vous avez deux options :

## Option 1 : Importer dans layout.tsx

Ajoutez cette ligne dans votre fichier `app/layout.tsx` avec les autres imports :

```typescript
import './styles/custom.css'
```

## Option 2 : Importer dans globals.css

Alternativement, vous pouvez copier tout le contenu du fichier `styles/custom.css` à la fin de votre fichier `app/globals.css` existant.

## Note importante

Les styles ont été créés dans un nouveau fichier pour éviter de modifier les fichiers existants. Ils incluent :
- Styles de scrollbar personnalisés
- Styles pour les champs du portfolio
- Styles pour les badges techniques
- Styles pour les conteneurs et les images
- Animations pour les icônes

Choisissez l'option qui convient le mieux à votre workflow. 